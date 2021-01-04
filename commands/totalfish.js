module.exports = {
    name: 'totalfish',
    description: "Gets the user's total fish",
    execute(message, args, db) {
        let userFish;
        let cutArgs;
        if (args[0] == null){ // if the user just types /totalfish, it returns their total fish
            db.collection(`${message.guild.id}`).doc(`${message.member.id}`).get().then((q) =>{
                if (!q.exists){
                    message.channel.send("You need to fish first! Use the fish command.");
                } else {
                    userFish = q.data().totalFish;
                    if (message.member.nickname != null){
                        message.channel.send(`**${message.member.nickname}**, you have caught a total of **${userFish}** fish!`);
                    } else {
                        message.channel.send(`**${message.member.user.username}**, you have caught a total of **${userFish}** fish!`);
                    }
                }
            })
        } else if (args != null){ // if the user @s someone, it returns the @'d user's fish
            if (args[0][0] != "<"){ // if it isn't a ping (they start with <), it yells at the user
                message.channel.send("Error finding user. Please use @user with this command.");
                return;
            }
            // Convert a string <@!107955610460372992> to 107955610460372992 so the db can use the number
            cutArgs = args[0].substring(args[0].indexOf("!") + 1, args[0].indexOf(">"));
            
            db.collection(`${message.guild.id}`).doc(`${cutArgs}`).get().then((q) =>{
                if (!q.exists){
                    message.channel.send("That user has not fished yet, or that user does not exist!");
                } else {
                    userFish = q.data().totalFish;
                    if (q.data().nickname != null){
                        message.channel.send(`**${q.data().nickname}** has caught a total of **${userFish}** fish!`);
                    } else {
                        message.channel.send(`**${q.data().username}** has caught a total of **${userFish}** fish!`);
                    }
                }
            }) 
        }
    }
}