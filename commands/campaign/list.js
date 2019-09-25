module.exports = {
    name: "list",
    args: [],
    func: (context, args) => {
        let {message, campaignInfo} = context;
        message.reply("List of existing campaigns:\n```" + Object.values(campaignInfo).map(campaign=>
            `[${campaign.id}]: ${campaign.title} - DMed by ${campaign.dms.map(dm=>message.channel.guild.members.get(dm).user.username).join(", ")}`
        ).join("\n") + "```");
    },
    help: {
        short: "Lists all campaigns.",
        long: "This command lists all existing campaigns.",
        syntax: "!campaign list"
    },
};