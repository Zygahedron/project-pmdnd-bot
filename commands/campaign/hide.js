module.exports = {
    name: "hide",
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
        if (typeof campaign.hidden == "boolean" && campaign.hidden == true) {
            message.reply(campaign.title + " is already hidden.");
            return;
        }
        let category = message.guild.channels.get(campaign.category);
        let channels = message.guild.channels.filter(channel => channel.parentID == category.id).array();
        // message.channel.send("Hiding " + channels.length + " channels:\n" + channels.join(", "));
        channels.forEach(channel => {
            let allow = [...channel.permissionOverwrites.filter(overwrite => 
                overwrite.allow & 1024 && overwrite.id != message.guild.id &&
                overwrite.id != message.guild.roles.find(role => role.name == "Mod").id
            ).keys()];
            let deny = [...channel.permissionOverwrites.filter(overwrite => 
                overwrite.deny & 1024 && overwrite.id != message.guild.id &&
                overwrite.id != message.guild.roles.find(role => role.name == "Muted").id
            ).keys()];
            allow.concat(deny).map(id => {
                channel.overwritePermissions(id, {
                    VIEW_CHANNEL: null
                });
            });
            channel.overwritePermissions(message.guild.id, {
                VIEW_CHANNEL: false
            });
            if (allow.length || deny.length) campaign.hiddenPermissions[channel.id] = {allow, deny};
        });
        category.setPosition(message.guild.channels.find(channel => channel.name == "===Hidden===").calculatedPosition);
        campaign.hidden = true;
        let infoChannel = message.guild.channels.find(c=>c.name=="campaign-info");
        infoChannel.fetchMessage(campaign.info).then(infoMessage=>{
            infoMessage.delete();
        },err=>{
            if (err.message = "Unknown Message") {
                
            } else {
                console.log(err);
            }
        });
        message.channel.send("Successfully hid the category.");
    },
    help: {
        short: "Hides campaign.",
        long: "This command hides a campaign. Hidden campaigns will retain any custom channel permissions when they are unhidden.",
        syntax: "!campaign hide <campaign>",
    },
    permission: "mod",
};