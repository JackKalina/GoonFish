const Deck = require('../deck.js');

module.exports = {
    name: 'decktest',
    description: 'decktest',
    execute(message, args, db) {
        if (message.author.id == "107955610460372992"){
            let deck = new Deck();
            deck.populateDeck();
            let deckstring = "";
            for (let card of deck.activeCards){
                deckstring += card.cardToString();
            }
            message.channel.send(deckstring);
            deck.shuffle();
            deckstring = "";
            for (let card of deck.activeCards){
                deckstring += card.cardToString();
            }
            message.channel.send(deckstring);
            deck.shuffle();
            deckstring = "";
            for (let card of deck.activeCards){
                deckstring += card.cardToString();
            }
            message.channel.send(deckstring);
            deck.shuffle();
            deckstring = "";
            for (let card of deck.activeCards){
                deckstring += card.cardToString();
            }
            message.channel.send(deckstring);
            message.channel.send("done");
        } else {
            message.channel.send("This command is not available to you!");
        }
    }
}