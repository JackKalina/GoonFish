module.exports = {
    name: 'totalfish',
    description: "Gets the user's total fish",
    execute(message, args, db) {
        let userFish;
        db.collection(`${message.guild.id}`).doc(`${message.member.id}`).get().then((q) =>{
            if (!q.exists){
                message.channel.send("You need to fish first! Use the fish command.");
            } else {
                userFish = q.data().totalFish;
                if (message.member.nickname != null){
                    message.channel.send(`${message.member.nickname}, you have caught **${userFish}** fish!`);
                } else {
                    message.channel.send(`${message.member.user.username}, you have caught **${userFish}** fish!`);
                }
            }
        })
    }
}