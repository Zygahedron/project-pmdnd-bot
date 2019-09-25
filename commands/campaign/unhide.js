module.exports = {
    name: "unhide",
    args: [
        {
            help: "`<campaign>` - The campaign to hide for",
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
        if (typeof campaign.hidden != "boolean" || campaign.hidden != true) {
            message.reply(campaign.title + " is not hidden.");
            return;
        }
        let category = message.guild.channels.get(campaign.category);
        let channels = message.guild.channels.filter(channel => channel.parentID == category.id).array();
        // message.channel.send("Unhiding " + channels.length + " channels:\n" + channels.join(", "));
        channels.forEach(channel => {
            channel.overwritePermissions(message.guild.id, {
                VIEW_CHANNEL: null
            });
            if (channel.id in campaign.hiddenPermissions) {
                campaign.hiddenPermissions[channel.id].allow.map(id => {
                    channel.overwritePermissions(id, {
                        VIEW_CHANNEL: true
                    });
                })
                campaign.hiddenPermissions[channel.id].deny.map(id => {
                    channel.overwritePermissions(id, {
                        VIEW_CHANNEL: false
                    });
                })
                delete campaign.hiddenPermissions[channel.id]
            }
        });
        category.setPosition(message.guild.channels.find(channel => channel.name == "===Hidden===").calculatedPosition - 1);
        campaign.hidden = false;
        context.cmd.runCommand(context, "c refreshInfo "+id);
        message.channel.send("Successfully unhid the category.");
    },
    help: {
        short: "Unhides campaign.",
        long: "This command unhides a campaign that has previously been hidden with the hide command.",
        syntax: "!campaign unhide <campaign>",
    },
    permission: "mod",
};