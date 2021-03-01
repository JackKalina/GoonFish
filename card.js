module.exports = class Card {
    constructor(number, suit, active = true){
        this.number = number;
        this.suit = suit;
        this.active = active;
    }

    cardToString(){
        let stringSuit;
        switch(this.suit){
            case "Spades":
                stringSuit = "♠️";
                break;
            case "Hearts":
                stringSuit = "♥️";
                break;
            case "Clubs":
                stringSuit = "♣️";
                break;
            case "Diamonds":
                stringSuit = "♦️";
                break;
        }
        return `${this.number}${stringSuit}`;
    }

    getValue() {
        let value;
        switch (this.number){
            case "Jack":
                value = 10;
                break;
            case "Queen":
                value = 10;
                break;
            case "King":
                value = 10;
                break;
            case "Ace":
                value = 11;
                break;
            default:
                value = parseInt(this.number);
        }
        return value;
    }
}