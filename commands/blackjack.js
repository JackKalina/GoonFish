const Deck = require('../deck.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'blackjack',
    description: 'blackjack',
    execute(message, args, db) {
        if (message.author.id == "107955610460372992"){
            console.log(args);
            let bet;
            if (args[0] == null){ // no bet? ask for one
                message.reply(`You need to bet fish! After blackjack, type the number of fish you want to bet.`);
            } else {
                db.collection(`${message.guild.id}`).doc(`${message.member.id}`).get().then((q) =>{
                    if (!q.exists){
                        message.channel.send("You need to fish first! Use the fish command.");
                    } else {
                        userFish = q.data().totalFish;
                        bet = args[0];
                        if (args[0] <= userFish){ // if the bet is lower than the user's fish, let them play
                            message.channel.send(`Starting new blackjack game with a bet of **${bet}** fish...`);
                            let deck = new Deck();
                            deck.populateDeck();
                            deck.shuffle();
                            deck.shuffle();
                            deck.shuffle();
                            deck.shuffle();
                            deck.shuffle(); // 5+ Shuffles is truly random according to magicians

                            let userCards = [];
                            let dealerCards = [];

                            // Initial deal: 2 cards to player, 2 cards to dealer
                            userCards.push(deck.activeCards[0]);
                            deck.activeCards.shift();
                            dealerCards.push(deck.activeCards[0]);
                            deck.activeCards.shift();
                            userCards.push(deck.activeCards[0]);
                            deck.activeCards.shift();
                            dealerCards.push(deck.activeCards[0]);
                            deck.activeCards.shift();

                            let embed = new MessageEmbed();
                                embed.setTitle("Blackjack");
                                embed.addField("Bet", `**${bet}** fish`)
                                embed.addField("Dealer's Hand:", `${dealerCards[0].cardToString()} 🃏`, true);
                                embed.addField("Your Hand:", `${userCards[0].cardToString()} ${userCards[1].cardToString()}`, true);
                                embed.addField("Options:", "Send in chat: Hit or Stand");
                            message.channel.send(embed);
                            let userCardTotals = [];
                            for (let card of userCards){
                                userCardTotals.push(card.getValue());
                            }
                            let userTotal = 0;
                            for (let card of userCards){
                                userTotal = userTotal + card.getValue();
                            }
                            // awaitMessages code I found
                            // Was looking for a way to respond to message replies, but that isn't built into discord.js yet (as far as I can tell)
                            // This operates in a perfect way for what I'm trying to achieve
                            if (userTotal == 21){
                                let embed = new MessageEmbed();
                                    embed.setTitle("Blackjack");
                                    embed.addField("Bet", `**${bet}** fish`)
                                    embed.addField("Your current total", `${userTotal}`);
                                    embed.addField("Dealer's Hand:", `${dealerCards[0].cardToString()} 🃏`, true);
                                    embed.addField("Your Hand:", `${generateCardString(userCards)}`, true);
                                    embed.addField("You win!", `You have won ${(parseInt(bet) * 2).toString()} fish.`);
                                message.channel.send(embed);
                            } else {
                                userGameLoop(message);
                            }
                            
                        } else {
                            message.reply(`you don't have **${bet}** fish! Please try again with a lower number (you currently have **${userFish}** fish).`);
                        }
                    }
                })
            }
            
        } else {
            message.channel.send("This command is not available to you!");
        }
    }
}

function userGameLoop(message){
    message.channel.awaitMessages(m => m.author.id == message.author.id,
        {max: 1, time: 30000}).then(collected => {
                // only accept messages by the user who sent the command
                // accept only 1 message, and return the promise after 30000ms = 30s
                // first (and, in this case, only) message of the collection
                console.log(collected.first().content.toString().toLowerCase());
                if (collected.first().content.toString().toLowerCase() === 'hit') {
                    userCards.push(deck.activeCards[0]);
                    deck.activeCards.shift();
                    let userCardTotals = [];
                    for (let card of userCards){
                        userCardTotals.push(card.getValue());
                    }
                    let userTotal = 0;
                    for (let card of userCards){
                        userTotal = userTotal + card.getValue();
                    }
                    if (userTotal < 21){
                        let embed = new MessageEmbed();
                            embed.setTitle("Blackjack");
                            embed.addField("Bet", `**${bet}** fish`)
                            embed.addField("Your current total", `${userTotal}`);
                            embed.addField("Dealer's Hand:", `${dealerCards[0].cardToString()} 🃏`, true);
                            embed.addField("Your Hand:", `${generateCardString(userCards)}`, true);
                            embed.addField("Options:", "Send in chat: Hit or Stand");
                        message.channel.send(embed);
                        userGameLoop(message);
                    } else if (userTotal > 21){
                        let embed = new MessageEmbed();
                            embed.setTitle("Blackjack");
                            embed.addField("Bet", `**${bet}** fish`)
                            embed.addField("Your current total", `${userTotal}`);
                            embed.addField("Dealer's Hand:", `${dealerCards[0].cardToString()} 🃏`, true);
                            embed.addField("Your Hand:", `${generateCardString(userCards)}`, true);
                            embed.addField("You lose!", `You have lost **${bet}** fish.`);
                        message.channel.send(embed);
                    } else if (userTotal == 21){
                        let embed = new MessageEmbed();
                            embed.setTitle("Blackjack");
                            embed.addField("Bet", `**${bet}** fish`)
                            embed.addField("Your current total", `${userTotal}`);
                            embed.addField("Dealer's Hand:", `${dealerCards[0].cardToString()} 🃏`, true);
                            embed.addField("Your Hand:", `${generateCardString(userCards)}`, true);
                            embed.addField("You win!", `You have won ${(parseInt(bet) * 2).toString()} fish.`);
                        message.channel.send(embed);
                    }
                }
                else if (collected.first().content.toLowerCase() == 'stand'){
                    let userCardTotals = [];
                    for (let card of userCards){
                        userCardTotals.push(card.getValue());
                    }
                } else {
                    message.reply("please say either hit or stand!");
                    userGameLoop(message);
                }
        }).catch(() => {
            message.reply('No answer after 30 seconds, game cancelled.');
        });
}

function generateCardString(cardArray){
    let cardString = "";
    for (let card of cardArray){
        cardString = cardString + card.cardToString();
    }
    return cardString;
}