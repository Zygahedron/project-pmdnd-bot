module.exports = {
    name: "title",
    args: [
        {
            help: "`<title>` - The new title",
            type: 'string'
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo, id} = context;
        let title = args[0];
        let category = message.channel.guild.channels.get(campaignInfo[id].category);
        category.setName(title);
        campaignInfo[id].title = title;
        message.reply("Campaign name successfully set.");
    },
    help: {
        short: "Change campaign title.",
        long: "Change the title of a campaign. Affects the category name and the #campaign-info message.",
        syntax: "!campaign config <id> title <title>"
    },
    permission: "dm",
};