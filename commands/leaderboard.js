const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'leaderboard',
    description: "Gets the server's leaderboard",
    execute(message, args, db) {
        let guildID = message.guild.id;
        let guildName = message.guild.name;
        let dictionary = {};
        let valuesArray = [];
        let guildPrefix;

        let embed = new MessageEmbed();
        embed.setTitle(`${guildName}'s fishing leaderboard (Top 10)`);

        async function getData(db) {
            const guildRef = db.collection(`${guildID}`);
            const snapshot = await guildRef.get(); // These make a snapshot of the guild as it was when the command was used
            snapshot.forEach(doc => {
                if (doc.id != "guildInfo"){
                    if (doc.data().nickname != null){
                        dictionary[doc.data().totalFish] = `${doc.data().nickname}`; // Creating a dictionary: [fish:name]
                    } else {
                        dictionary[doc.data().totalFish] = `${doc.data().name}`;
                    }
                } else if (doc.id === "guildInfo"){
                    guildPrefix = doc.data().prefix;
                } 
            })
        }

        getData(db).then(() => { // When the object is made it's naturally in ascending order by number. 
            for (let key in dictionary){
                valuesArray.push(key); // Pushing all fish values into an array
            }
            if (valuesArray.length > 10) { // Getting rid of all but the top 10
                valuesArray.length = 10;
            }
            for (let i = valuesArray.length-1; i>-1; i--){
                // Adding fields to embed message for each of the top 10
                embed.addField(`${valuesArray.length - i}. ${dictionary[valuesArray[i]]}`, `${valuesArray[i]} fish`); 
            }
            if (valuesArray.length == 0){
                embed.addField("No one has fished yet!", `Use ${guildPrefix}fish to fish.`)
            }
        }).then(() => {
            message.channel.send(embed);
        });
        
        

    }
}