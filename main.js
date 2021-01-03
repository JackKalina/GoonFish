const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json'); // Uses a seperate json file to store discord bot token- config.json is in gitignore so that the token isn't public on github

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log("Logging into firebase...");
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

let prefix;
let serverCount = 0;
let userCount = 0;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore();

console.log("Logged into firebase.\n");

console.log("Loading commands...");
for (const file of commandFiles) { 
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded command ${command.name}.`);
}

console.log("Loaded commands.\n");
client.once('ready', () => {
    console.log('Ready!');
    db.collection("BotStats").doc("Statistics").get().then((q) => {
        if (q.exists){
            serverCount = q.data().totalServers;
            userCount = q.data().totalUsers;
        }
    }).then(() => {
        console.log(`Currently serving ${serverCount} servers with ${userCount} total users.\n`);
    });
    client.user.setStatus('available');
    client.user.setActivity("nature", {
        type: "LISTENING"
    });
});

client.on('message', message => {
    // Check guild's database for its set prefix
    db.collection(`${message.guild.id}`).doc('guildInfo').get().then((q) => {
        if (q.exists){
            prefix = q.data().prefix;
        }
    }).then(() =>{
        // Discord.js's prewritten command handling (with a few tweaks). If it ain't broke, don't fix it
        if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "dm") return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(message, args, db);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }

    })

	
});

// On guild join, creates a new firestore collection that stores guild name, owner, member count, and prefix
client.on('guildCreate', guild => {
    try {
        // Create a new Firestore collection
        db.collection(`${guild.id}`).doc('guildInfo').set({
            'guildName': guild.name,
            'guildMemberCount': guild.memberCount,
            'prefix': '/'
        });
        console.log(`Joined new server ${guild.name}`);
        console.log(`Created new Firestore collection ${guild.id}\n`);
        // Update total servers and users (unimportant, just statistics but I like statistics)
        serverCount = serverCount + 1;
        userCount = userCount + guild.memberCount;
        // Update statistics collection (again unnecessary... just nice)
        db.collection("BotStats").doc("Statistics").update({
            'totalServers': serverCount,
            'totalUsers': userCount 
        });
        console.log(`Currently serving ${serverCount} servers with ${userCount} total users`);
    } catch (err){
        console.log(err);
    }
});
client.login(config.token);
