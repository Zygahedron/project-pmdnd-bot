module.exports = {
    name: "setpattern",
    args: [
        {
            help: "`<pattern>` - A Regular Expression to find the password within the password message.",
            type: 'rest'
        },
    ],
    func: (context, args) => {
        let {message, pw, bot} = context
        pw.pattern = args[0]
        bot.guilds.get(pw.guild).channels.get(pw.channel).fetchMessage(pw.message).then(msg=>{
            let match = msg.content.match(new RegExp(pw.pattern))
            if (match && match[1]) {
                pw.password = match[1].toLowerCase();
                console.log("Password is set to `" + pw.password + "`.");
                message.reply("Password pattern updated.")
            } else {
                message.reply("Password pattern updated. Password message does not contain the chosen pattern. Please update.");
            }
        });
    },
    help: {
        short: "Sets the password pattern.",
        long: "Sets the RegExp pattern used to find the password within the password message. ",
        syntax: "!password guild <id>",
    },
};