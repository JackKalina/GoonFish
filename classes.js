class Card {
    constructor(number, suit, active = true){
        this.number = number;
        this.suit = suit;
        this.active = active;
    }
}

class Deck {
    constructor(){
        this.activeCards = [];
        this.inactiveCards = [];
    }

    populateDeck(){
        let suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
        let numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
        for (let suit of suits){
            for (let number of numbers){
                this.activeCards.push(new Card(number, suit));
            }
        }
    }

    discardCard(card){
        card.active = false;
        this.activeCards.pop(this.activeCards.indexOf(card));
        this.inactiveCards.push(card);
    }

    
}