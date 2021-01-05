const Card = require('./card.js');

module.exports = class Deck {
    constructor(){
        this.activeCards = [];
        this.inactiveCards = [];
    }

    populateDeck(){
        let suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
        let numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        for (let suit of suits){
            for (let number of numbers){
                let newCard = new Card(number, suit);
                this.activeCards.push(newCard);
            }
        }
    }

    discardCard(card){
        card.active = false;
        this.activeCards.pop(this.activeCards.indexOf(card));
        this.inactiveCards.push(card);
    }

    shuffle(){
        for (let i = this.activeCards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.activeCards[i], this.activeCards[j]] = [this.activeCards[j], this.activeCards[i]];
        }
    }
}