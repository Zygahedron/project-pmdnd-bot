module.exports = {
    name: "color",
    args: [
        {
            help: "`<color>` - The new color",
            type: 'color'
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo, id} = context;
        let color = args[0];
        let role = message.channel.guild.roles.get(campaignInfo[id].role);
        role.setColor(color);
        campaignInfo[id].color = color;
    },
    help: {
        short: "Change campaign color.",
        long: "Change the color used to represent the campaign. This affects the role and the #campaign-info message.",
        syntax: "!campaign config <id> color <color>"
    },
    permission: "dm",
};