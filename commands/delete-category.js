module.exports = {
    name: "delete-category",
    args: [
        {
            help: "`\"<category name>\"` - Which category to delete",
            type: 'string'
        }
    ],
    func: (context, args) => {
        let {message, awaitingConfirmation} = context;
        let category = message.guild.channels.find(channel => channel.name.toLowerCase() == args[0]);
        if (!category || category.type != "category") {
            message.reply("Cannot find category.");
            return;
        }
        let channels = message.guild.channels.filter(channel => channel.parentID == category.id).array();
        message.channel.send("Deleting " + channels.length + " channels:\n" + channels.join("\n") + "\n\nPlease `$confirm` or `$cancel` this action.");
        awaitingConfirmation[message.author.id] = ()=>{
            channels.forEach(channel => {
                channel.delete();
            });
            category.delete();
            message.channel.send("Successfully deleted the category.");
        };
    },
    help: {
        short: "Deletes a category.",
        long: "Deletes a category and all channels in it.",
        syntax: "$delete-category \"<category name>\""
    },
    permission: "mod",
};