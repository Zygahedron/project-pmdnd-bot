module.exports = {
    name: "refreshInfo",
    args: [
        {
            help: "`<campaign>` - Which campaign to refresh",
            type: 'word'
        }
    ],
    func: (context, args) => {
        let {message, awaitingConfirmation, campaignInfo} = context;
        let id = args[0];
        if (!(id in campaignInfo)) {
            message.reply("No campaign exists with the given id.");
            return;
        }
        let campaign = campaignInfo[id];
        let embed = {
            color: +campaign.color.replace("#","0x"),
            title: campaign.title,
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
        let infoChannel = message.guild.channels.find(c=>c.name=="campaign-summaries");
        infoChannel.fetchMessage(campaign.info).then(infoMessage=>{
            infoMessage.edit({embed});
        },err=>{
            if (err.message = "Unknown Message") {
                infoChannel.send({embed}).then(infoMessage=>{
                    campaign.info = infoMessage.id;
                });
            } else {
                console.log(err);
            }
        });
        
    },
    help: {
        short: "Refreshes a campaign's info embed.",
        long: "Refreshes the message in #campaign-info.",
        syntax: "$campaign refreshInfo <campaign>"
    },
};