module.exports = {
    name: "active",
    aliases: ["member", "pingme"],
    args: [],
    func: (context, args) => {
        let {member, message} = context;
        if (member.roles.find(role => role.name == "Spectator")) {
            member.addRole(member.guild.roles.find(role => role.name == "Active"));
            member.removeRole(member.guild.roles.find(role => role.name == "Spectator"));
            message.reply("Your role has been successfully updated.")
        } else if (member.roles.find(role => role.name == "Active")) {
            message.reply("You already have the Active role. If you wish to remove it, use the `!spectator` command instead.")
        } else {
            message.reply("Please confirm that you have read the rules first. Also this message shouldn't ever appear. Hmm.")
        }
    },
    help: {
        short: "Grants the Active role.",
        long: "This command gives the user the Active role, as apposed to the Spectator role. This means that they will recieve pings when new campaigns open.",
        syntax: "!active",
    },
};