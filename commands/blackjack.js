const Deck = require('../deck.js');

module.exports = {
    name: 'blackjack',
    description: 'blackjack',
    execute(message, args, db) {
        if (message.author.id == "107955610460372992"){
            console.log(args);
            let bet;
            if (args[0] == null){
                message.reply(`You need to bet fish! After blackjack, type the number of fish you want to bet.`);
            } else {
                db.collection(`${message.guild.id}`).doc(`${message.member.id}`).get().then((q) =>{
                    if (!q.exists){
                        message.channel.send("You need to fish first! Use the fish command.");
                    } else {
                        userFish = q.data().totalFish;
                        if (args[0] <= userFish){
                            bet = args[0];
                            message.channel.send(`Starting new blackjack game with a bet of ${bet} fish...`);
                        } else {
                            message.reply(`, you don't have ${bet} fish! Please try again with a lower number (use the totalfish command to check how many fish you have).`);
                        }
                    }
                })
            }
            let deck = new Deck();
            deck.populateDeck();
            deck.shuffle();
            deck.shuffle();
            deck.shuffle();
            deck.shuffle();
            deck.shuffle();
        } else {
            message.channel.send("This command is not available to you!");
        }
    }
}