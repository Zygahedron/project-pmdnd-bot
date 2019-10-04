const CmdHandler = require("../cmd-handler.js");
const scmd = new CmdHandler("./commands/campaign");
const jsonProxy = require('../jsonproxy.js');
const campaignInfo = jsonProxy('campaign-info.json');

module.exports = {
    name: "campaign",
    aliases: ["c"],
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
        context.campaignInfo = campaignInfo;
        scmd.runCommand(context, args.join(" "));
    },
    help: {
        short: "Commands relating to campaign management.",
        long: "Commands relating to campaign management.",
        syntax: "$campaign <subcommand> [args]"
    }
};