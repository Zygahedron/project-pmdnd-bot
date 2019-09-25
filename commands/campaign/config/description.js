module.exports = {
    name: "description",
    aliases: ["desc"],
    args: [
        {
            help: "`<description>` - The new description",
            type: 'string'
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo, id} = context;
        let desc = args[0];
        campaignInfo[id].desc = desc;
        message.reply("Campaign description successfully set.");
    },
    help: {
        short: "Change campaign description.",
        long: "Change the description of a campaign, as shown in #campaign-info.",
        syntax: "!campaign config <id> description <description>"
    },
    permission: "dm",
};