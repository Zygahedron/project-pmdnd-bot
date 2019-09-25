const CmdHandler = require("../cmd-handler.js");
const scmd = new CmdHandler("./commands/test");

module.exports = {
    name: "test",
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
        scmd.runCommand(context, args.join(" "));
    },
    help: {
        short: "Test command",
        long: "Test command.",
        syntax: "!test <subcommand> [args]"
    }
};