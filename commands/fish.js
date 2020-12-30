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
            return num;
        }
        function convertTime(ms){
            let seconds = ms / 1000;
            //let hours = parseInt(seconds/3600);
            //seconds = seconds % 3600;
            let minutes = parseInt(seconds/60); 
            seconds = seconds % 60;
            seconds = Math.floor(seconds);
            return (`${minutes} minutes ${seconds} seconds`);
        }
        function fish(){
            numFish = generateNumber(0, 1000, 3.5);
            newFishTotal = userFish + numFish; // Generates a number and adds it to user's current number of fish
            db.collection(`${message.guild.id}`).doc(`${message.member.id}`).set({
                'totalFish': newFishTotal,
                'lastFishTime': timeAtCall,
                'name': message.member.user.username,
                'nickname': message.member.nickname
            }); // Sets data in db
            message.channel.send(`You caught **${numFish}** fish!`); 
        }
        // This generates 100 random numbers in order to help check distribution. Uncomment it when you need to tweak balance.
        /*  
        for (let i = 0; i < 100; i++){
            generateNumber(0, 1000, 3.5);
        }
        */
        let numFish;
        let userFish;
        let newFishTotal;
        let userFishTime;
        let timeAtCall = Date.now();
        db.collection(`${message.guild.id}`).doc(`${message.member.id}`).get().then((q) => { // Checking if the user has data in Firestore
            if (q.exists) { // If they do, pull it
                userFish = q.data().totalFish;
                userFishTime = q.data().lastFishTime;
            } else { // Else, set the userFish to 0 and call fish function
                userFish = 0;
                userFishTime = 1;
            }
        }).then(() => {
            if (timeAtCall - userFishTime > 3600000 || userFishTime === 1) {
                fish();
            } else {
                let timeDiff = timeAtCall - userFishTime; 
                message.channel.send(`Slow down! You can fish again in ${convertTime(3600000 - timeDiff)}.`);
            }
        });
        
        
        

    }
}