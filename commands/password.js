const CmdHandler = require("../cmd-handler.js");
const scmd = new CmdHandler("./commands/password");
const jsonProxy = require('../jsonproxy.js');
const pw = jsonProxy('password.json');

module.exports = {
    name: "password",
    aliases: ["pw"],
    args: [
        {
            help: "`<subcommand>` - Which subcommand to run",
            type: 'word'
        },
        {
            help: "`[args]` - Arguments for the subcommand",
            type: 'rest',
            optional: true
        }
    ],
    func: (context, args) => {
        context.pw = pw;
        scmd.runCommand(context, args.join(" "));
    },
    help: {
        short: "Commands relating to password management.",
        long: "Commands relating to password management.",
        syntax: "$password <subcommand> [args]"
    },
    permission: "mod",
};