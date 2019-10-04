module.exports = {
    name: "new",
    args: [
        {
            help: "`<id>` - Identifier for the campaign; should be a 2-4 letter abbreviation. Used for role name, etc.",
            type: 'word',
        },
        {
            help: "`<title>` - The full name of the campaign",
            type: 'string'
        },
        {
            help: "`<color>` - The color for the campaign role etc to use",
            type: 'color',
        },
        {
            help: "`<DMs>` - One or more dms to run the campaign",
            type: 'user',
            repeat: -1,
        },
        {
            help: "`[description]` - A description of the campaign (optional)",
            type: 'string',
            optional: true,
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo} = context;
        let [id, title, color, dms] = args;
        if (id in campaignInfo) {
            message.reply("A campaign already exists with this id.");
            return;
        }
        if (Object.values(campaignInfo).find(c=>c && c.title == title)) {
            message.reply("A campaign already exists with this title.");
            return;
        }
        message.guild.createRole({
            name: id,
            hoist: false,
            mentionable: true,
            color: color
        }).then(async role => {
            let category = await message.guild.createChannel(title, 'category', [
                {
                    id: message.guild.roles.find(role => role.name == "Mod"),
                    allow: ['MANAGE_CHANNELS','MANAGE_ROLES_OR_PERMISSIONS','VIEW_CHANNEL','SEND_MESSAGES','MANAGE_MESSAGES','SPEAK','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS']
                },
                {
                    id: message.guild.roles.find(role => role.name == "Muted"),
                    deny: ['READ_MESSAGES']
                },
                {
                    id: role,
                    allow: ['SEND_MESSAGES','SPEAK']
                },
                {
                    id: message.guild.id,
                    deny: ['SEND_MESSAGES','ADD_REACTIONS','SPEAK']
                }
            ].concat(dms.map(dm => ({
                id: dm,
                allow: ['MANAGE_CHANNELS','MANAGE_ROLES_OR_PERMISSIONS','SEND_MESSAGES','MANAGE_MESSAGES','ADD_REACTIONS','SPEAK','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS']
            }))));
            await message.guild.createChannel(id+"-ic", 'text').then(async channel => {
                await channel.setParent(category.id);
                await lockPermissionsFixed.apply(channel);
            });
            await message.guild.createChannel(id+"-info", 'text').then(async channel => {
                await channel.setParent(category.id);
                await lockPermissionsFixed.apply(channel);
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: null,
                    SPEAK: null
                });
            });
            await message.guild.createChannel(id+"-ooc", 'text').then(async channel => {
                await channel.setParent(category.id);
                await lockPermissionsFixed.apply(channel);
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: null,
                    SPEAK: null
                });
                await channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: null,
                    ADD_REACTIONS: null,
                    SPEAK: null
                });
            });
            category.setPosition(message.guild.channels.find(channel => channel.name == "===Hidden===").calculatedPosition - 1);
            campaignInfo[id] = {
                id, title, color, dms: dms.map(dm=>dm.id),
                role: role.id, category: category.id,
            }
            await message.channel.send("Successfully created a new campaign!");
            context.cmd.runCommand(context, "c info "+id);
            context.cmd.runCommand(context, "c refreshInfo "+id);
        }).catch(err => {
            console.log(err);
        });
    },
    help: {
        short: "Creates a new campaign. Only usable by mods.",
        long: "This command creates a new campaign, including a role, category, and an entry in the campaign list.",
        syntax: "$campaign new <id> <title> <color> <DMs> [description (NYI)]"
    },
    permission: "mod",
};

// the version of this function in discord.js is broken, and while the github pull request for the fix has been merged, npm doesn't install the version with the fix.
function lockPermissionsFixed() {
    if (!this.parent) return Promise.reject(new TypeError('Could not find a parent to this guild channel.'));
    const permissionOverwrites = this.parent.permissionOverwrites.map(overwrite => ({
        deny: overwrite.deny, //.bitfield
        allow: overwrite.allow, //.bitfield
        id: overwrite.id,
        type: overwrite.type,
    }));
    return this.edit({ permissionOverwrites });
}