module.exports = {
    name: "status",
    args: [
        {
            help: "`<status>` - The new status",
            type: 'string'
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo, id} = context;
        let status = args[0];
        campaignInfo[id].status = status;
        message.reply("Campaign status successfully set.");
    },
    help: {
        short: "Change campaign status.",
        long: "Change the status of a campaign. Useful for hiatus, or to show new players are being accepted, etc.",
        syntax: "$campaign config <id> status <status>"
    },
    permission: "dm",
};