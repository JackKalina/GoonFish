module.exports = class Card {
    constructor(number, suit, active = true){
        this.number = number;
        this.suit = suit;
        this.active = active;
        this.value;
    }

    cardToString(){
        let stringNum;
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
        switch (this.number){
            case "Jack":
                stringNum = "J";
                break;
            case "Queen":
                stringNum = "Q";
                break;
            case "King":
                stringNum = "K";
                break;
            case "Ace":
                stringNum = "A";
                break;
            default:
                stringNum = this.number;
        }
        return `${this.number}${stringSuit}`;
    }
}