module.exports = {
    name: "delete",
    args: [
        {
            help: "`<campaign>` - Which campaign to delete",
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
        message.reply("Deleting the campaign '"+campaign.title+"'. Please `!confirm` or `!cancel` this action.")
        awaitingConfirmation[message.author.id] = ()=>{
            message.guild.roles.get(campaign.role).delete();
            delete campaignInfo[id];
            let category = message.guild.channels.get(campaign.category);
            let channels = message.guild.channels.filter(channel => channel.parentID == category.id).array();
            channels.forEach(channel => {
                channel.delete();
            });
            category.delete();
            message.channel.send("Successfully deleted the campaign.");
        };
    },
    help: {
        short: "deletes a campaign.",
        long: "Deletes all data related to a campaign, including its summary embed and its role.",
        syntax: "!campaign delete <campaign>"
    },
    permission: "mod",
};