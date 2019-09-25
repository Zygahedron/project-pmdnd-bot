module.exports = {
    name: "dm",
    args: [],
    func: (context, args) => {
        context.message.reply("👌");
    },
    help: {
        short: "Check permissions for dm",
        long: "Check if the user is a dm.",
        syntax: "!test dm"
    },
    permission: "dm",
};