const CmdHandler = require("../../cmd-handler.js");
const scmd = new CmdHandler("./commands/campaign/config");

module.exports = {
    name: "config",
    aliases: ["edit"],
    args: [
        {
            help: "`<id>` - Identifier of the campaign to configure",
            type: 'word'
        },
        {
            help: "`<property>` - The property to configure",
            type: 'word',
        },
        {
            help: "`<args...>` - How to configure the campaign; syntax depends on what property is being configured",
            type: 'rest',
        },
    ],
    func: (context, args) => {
        let {message, campaignInfo} = context;
        let id = args[0];
        if (id == "help") {
            return scmd.runCommand({}, "help " + args[1]);
        }
        if (!(id in campaignInfo)) {
            message.reply("No campaign exists with the given id.");
            return;
        }
        context.id = id;
        scmd.runCommand(context, args.slice(1).join(" "));
        context.cmd.runCommand(context, "campaign refreshInfo "+context.id);
    },
    help: {
        short: "Configures campaign information.",
        long: "This command configures properties campaign, such as name, dms, or description. A list of configureable properties is as follows:\n```http\n" + scmd.getCommandList()+"```",
        syntax: "!campaign config <id> <property> <value...>"
    },
    permission: "dm"
};