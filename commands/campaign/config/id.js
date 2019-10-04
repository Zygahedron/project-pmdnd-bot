module.exports = {
    name: "id",
    args: [
        {
            help: "`<id>` - The new id",
            type: 'word'
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo, id} = context;
        let newid = args[0];
        if (newid in campaignInfo) {
            message.reply("A campaign already exists with that ID.");
            return;
        }
        campaignInfo[newid] = campaignInfo[id];
        delete campaignInfo[id];
        campaignInfo[newid].id = newid
        context.id = newid;
        let role = message.channel.guild.roles.get(campaignInfo[newid].role);
        role.setName(newid);
        let category = message.channel.guild.channels.get(campaignInfo[newid].category);
        category.children.map(ch=>{
            ch.setName(ch.name.replace(new RegExp("\\b"+id+"\\b","g"),newid))
        });
        message.reply("Campaign id successfully changed.");
    },
    help: {
        short: "Change campaign id.",
        long: "Change the id of a campaign. Affects the role name, channel names, and the id used to refer to it in commands.",
        syntax: "$campaign config <id> title <title>"
    },
    permission: "dm",
};