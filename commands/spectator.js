module.exports = {
    name: "spectator",
    aliases: ["lurker", "inactive", "dontpingme"],
    args: [],
    func: (context, args) => {
        let {member, message} = context;
        if (member.roles.find(role => role.name == "Active")) {
            member.addRole(member.guild.roles.find(role => role.name == "Spectator"));
            member.removeRole(member.guild.roles.find(role => role.name == "Active"));
            message.reply("Your role has been successfully updated.")
        } else if (member.roles.find(role => role.name == "Spectator")) {
            message.reply("You already have the Spectator role. If you wish to remove it, use the `$active` command instead.")
        } else {
            message.reply("Please confirm that you have read the rules first. Also this message shouldn't ever appear. Hmm.")
        }
    },
    help: {
        short: "Grants the Spectator role.",
        long: "This command gives the user the Spectator role, as opposed to the Active role. This means that they will NOT receive pings when new campaigns open.",
        syntax: "$spectator",
    },
};