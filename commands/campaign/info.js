module.exports = {
    name: "info",
    args: [
        {
            help: "`<campaign>` - The campaign to show info for",
            type: "word",
        }
    ],
    func: (context, args) => {
        let {message, campaignInfo} = context;
        let id = args[0];
        if (!(id in campaignInfo)) {
            message.reply("No campaign exists with the given id.");
            return;
        }
        let campaign = campaignInfo[id];
        let embed = {
            color: +campaign.color.replace("#","0x"),
            title: "Campaign Info - " + campaign.title,
            description: campaign.desc || "No description set.",
            fields: [
                {
                    name: "DMed by:",
                    value: campaign.dms.map(id=>"<@"+id+">").join(", "),
                    inline: true,
                },
                {
                    name: "Role:",
                    value: "<@&"+campaign.role+">",
                    inline: true,
                }
            ],
        };
        if (campaign.status) {
            embed.fields.push({
                name: "Status:",
                value: campaign.status || "No status set.",
                inline: true,
            });
        }
        message.channel.send({embed});
    },
    help: {
        short: "Shows campaign info.",
        long: "This command shows a campaign's title, description, dm(s), etc.",
        syntax: "!campaign info <campaign>",
    },
};