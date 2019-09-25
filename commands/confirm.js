module.exports = {
    name: "confirm",
    args: [],
    func: (context, args) => {
        let {message, awaitingConfirmation} = context;
        if (awaitingConfirmation[message.author.id]) {
            awaitingConfirmation[message.author.id]()
            delete awaitingConfirmation[message.author.id];
        } else {
            message.reply("Nothing is currently awaiting your confirmation.")
        }
    }
};