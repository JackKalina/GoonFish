module.exports = {
    name: 'ping',
    description: 'Ping',
    execute(message, args, db) {
        message.channel.send('ping');
    }
}