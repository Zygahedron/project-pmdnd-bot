module.exports = {
    name: "mod",
    args: [],
    func: (context, args) => {
        context.message.reply("👌");
    },
    help: {
        short: "Check permissions for mod",
        long: "Check if the user is a mod.",
        syntax: "!test mod"
    },
    permission: "mod",
};