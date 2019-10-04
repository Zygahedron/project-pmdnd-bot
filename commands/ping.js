module.exports = {
    name: "ping",
    args: [],
    func: (context, args) => {
        context.message.reply("Pong!");
    },
    help: {
        short: "Verify that the bot is running",
        long: "This simple command accepts no arguments, simply giving a response if the bot is able to do so.",
        syntax: "$ping"
    }
};