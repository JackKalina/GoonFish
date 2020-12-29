module.exports = {
    name: 'changeprefix',
    description: 'Changes bot prefix on this server',
    execute(message, args, db){
        // if there are no arguments, yell at the user
        if (args.length === 0){
            message.channel.send("Please include a prefix!");
        } else if (args.length === 1){ // check if there is a 1 character argument. no long prefixes here, they're annoying
            let newPrefix = args[0];
            // Update the collection then tell the user and the console.
            db.collection(`${message.guild.id}`).doc('guildInfo').update({
                'prefix': newPrefix
            }).then(() => {
                message.channel.send(`Prefix changed to ${newPrefix}`);
                console.log(`Updated prefix in ${message.guild.name} to ${newPrefix}`);
            })
        }

    }
}