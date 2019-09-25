module.exports = {
    name: "cancel",
    args: [],
    func: (context, args) => {
        let {message, awaitingConfirmation} = context;
        if (awaitingConfirmation[message.author.id]) {
            delete awaitingConfirmation[message.author.id];
            message.reply("Action canceled.");
        } else {
            message.reply("Nothing is currently awaiting your confirmation.")
        }
    }
};