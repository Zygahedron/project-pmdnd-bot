module.exports = {
    name: "setmessage",
    args: [
        {
            help: "`<guild>` - The ID of the guild.",
            type: 'word'
        },
        {
            help: "`<channel>` - The ID of the channel.",
            type: 'word'
        },
        {
            help: "`<message>` - The ID of the message.",
            type: 'word'
        },
    ],
    func: (context, args) => {
        let {message, pw, bot} = context;
        let temp;
        if ((temp = bot.guilds.get(args[0]))) {
            if ((temp = temp.channels.get(args[1]))) {
                temp.fetchMessage(args[2]).then(msg => {
                    if (msg) {
                        pw.guild = args[0];
                        pw.channel = args[1];
                        pw.message = args[2];
                        let match = msg.content.match(new RegExp(pw.pattern))
                        if (match && match[1]) {
                            pw.password = match[1].toLowerCase();
                            console.log("Password is set to `" + pw.password + "`.");
                            message.reply("Password message updated.")
                        } else {
                            message.reply("Password message updated. Chosen message does not contain the current pattern. Please update.");
                        }
                    } else {
                        message.reply("Invalid message, please verify the ID.");
                    }
                });
            } else {
                message.reply("Invalid channel, please verify the ID.");
            }
        } else {
            message.reply("Invalid guild, please verify the ID.");
        }
    },
    help: {
        short: "Sets the password message.",
        long: "Sets the message that the password is stored in. ",
        syntax: "!password guild <id>",
    },
};