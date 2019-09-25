module.exports = {
    name: "dm",
    args: [
        {
            help: "`<add|remove>` - Whether to add or remove a DM",
            type: 'word',
        },
        {
            help: "`<user>` - The user to add or remove as a DM",
            type: 'user',
            repeat: -1
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo, id} = context;
        let action = args[0];
        let users = args[1].map(user=>user.id);
        let category = message.channel.guild.channels.get(campaignInfo[id].category);
        switch (action) {
            case "add":
                campaignInfo[id].dms = campaignInfo[id].dms.concat(users);
                users.forEach(user=>{
                    category.overwritePermissions(user, {
                        MANAGE_CHANNELS: true,
                        MANAGE_ROLES_OR_PERMISSIONS: true,
                        SEND_MESSAGES: true,
                        MANAGE_MESSAGES: true,
                        ADD_REACTIONS: true,
                        SPEAK: true,
                        MUTE_MEMBERS: true,
                        DEAFEN_MEMBERS: true,
                        MOVE_MEMBERS: true,
                    });
                    category.children.array().forEach(channel=>{
                        channel.overwritePermissions(user, {
                            MANAGE_CHANNELS: true,
                            MANAGE_ROLES_OR_PERMISSIONS: true,
                            SEND_MESSAGES: true,
                            MANAGE_MESSAGES: true,
                            ADD_REACTIONS: true,
                            SPEAK: true,
                            MUTE_MEMBERS: true,
                            DEAFEN_MEMBERS: true,
                            MOVE_MEMBERS: true,
                        });
                    });
                });
                message.reply("Successfully added " + (users.length > 1 ? users.length + "DMs" : "a DM") + " to the campaign.")
                break;
            case "remove":
                campaignInfo[id].dms = campaignInfo[id].dms.filter(dm=>!users.includes(dm));
                users.forEach(user=>{
                    category.overwritePermissions(user, {
                        MANAGE_CHANNELS: null,
                        MANAGE_ROLES_OR_PERMISSIONS: null,
                        SEND_MESSAGES: null,
                        MANAGE_MESSAGES: null,
                        ADD_REACTIONS: null,
                        SPEAK: null,
                        MUTE_MEMBERS: null,
                        DEAFEN_MEMBERS: null,
                        MOVE_MEMBERS: null,
                    });
                    category.children.array().forEach(channel=>{
                        channel.overwritePermissions(user, {
                            MANAGE_CHANNELS: null,
                            MANAGE_ROLES_OR_PERMISSIONS: null,
                            SEND_MESSAGES: null,
                            MANAGE_MESSAGES: null,
                            ADD_REACTIONS: null,
                            SPEAK: null,
                            MUTE_MEMBERS: null,
                            DEAFEN_MEMBERS: null,
                            MOVE_MEMBERS: null,
                        });
                    });
                });
                message.reply("Successfully removed " + (users.length > 1 ? users.length + "DMs" : "a DM") + " from the campaign.")
                break;
            default:
                throw "Invalid action `" + action + "` (should be add or remove)"
        }
    },
    help: {
        short: "Add or remove DMs.",
        long: "Either add or remove a DM from the campaign. Multiple can be specified.",
        syntax: "!campaign config <id> dm <add|remove> <user>"
    },
    permission: "dm",
};