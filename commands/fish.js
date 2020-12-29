module.exports = {
    name: 'fish',
    description: 'Fish for fish',
    execute(message, args, db){
        function generateNumber(min,max,skew){ // This probably would have been a lot easier to figure out (and a lot less confusion and googling) if I had ever taken a stats class
            let u = 0, v = 0;                  // This is all applying a box-muller transform to give it a min, max, and skew
            while ( u === 0 ) {                // Shoutout to stackoverflow for helping me understand how this works
                u = Math.random();
            };
            while (v === 0 ) {
                v = Math.random();
            };
            let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); 
            num = num / 10.0 + 0.5;
            if (num > 1 || num < 0) {
                num = generateNumber(min, max, skew);
            }
            num = Math.pow(num, skew);
            num *= max - min;
            num += min;
            num = Math.floor(num);
            console.log(`Generated number: ${num}`);
            return num;
        }
        // This generates 100 random numbers in order to help check distribution. Uncomment it when you need to tweak balance.
        /*  
        for (let i = 0; i < 100; i++){
            generateNumber(0, 1000, 3.5);
        }
        */
        let numFish = generateNumber(0, 1000, 3.5);
        let userFish;
        let userFishTime;
        db.collection(`${message.guild.id}`).doc(`${message.member.id}`).get().then((q) => {
            if (q.exists) {
                userFish = q.data().totalFish;
                userFishTime = q.data().lastFishTime;
            } else {
                db.collection(`${message.guild.id}`).doc(`${message.member.id}`).set({
                    'totalFish': 0,
                    'lastFishTime': 0
                })
            }
        });
        message.channel.send(`You caught **${generateNumber(0, 1000, 3.5)}** fish!`); // 0, 1000, 2.5 seems to give me the nicest balance of numbers
    }
}