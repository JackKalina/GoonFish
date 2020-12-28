const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json'); // Uses a seperate json file to store discord bot token- config.json is in gitignore so that the token isn't public on github

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) { 
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    // discord.js's prewritten command handling
    // as of right now, this doesn't need to be changed
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
