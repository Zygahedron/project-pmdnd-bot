const fs = require('fs');

class CmdHandler {
    constructor(dir) {
        this.dir = dir;
        this.loadCommands();
    }
    loadCommands() {
        let files = fs.readdirSync(this.dir);
        this.commands = {};
        files.forEach(file => {
            if (fs.statSync(this.dir + "/" + file).isDirectory()) return;
            this.loadCommand(file);
        });
        console.log("Commands loaded from " + this.dir);
    }
    loadCommand(file) {
        if (require.cache[require.resolve(this.dir + "/" + file)]) delete require.cache[require.resolve(this.dir + "/" + file)];
        let command = require(this.dir + "/" + file);
        this.commands[command.name] = command;
        if (command.aliases) command.aliases.forEach(alias=>{
            this.commands[alias] = command;
        });
    }
    runCommand(context, commandString) {
        let commandName = commandString.split(/\s+/,1)[0];
        if (commandName == "help") {
            if (commandString == "help") {
                let permissionlevel = 0
                if (context.campaignInfo && (context.id in context.campaignInfo)) {
                    if (context.campaignInfo[context.id].dms.filter(x=>x==context.member.id).length) permissionlevel = 1;
                } else {
                    if (context.member.roles.find(role => role.name == "DM")) permissionlevel = 1;
                }
                if (context.member.roles.find(role => role.name == "Mod")) permissionlevel = 2;
                context.message.reply("List of commands:\n```http\n" + this.getCommandList(permissionlevel) +
                    "```Type `$help <command name>` for more information on a specific command."
                );
            } else {
                let str = commandString.substring(5);
                if (str in this.commands) {
                    let command = this.commands[str];
                    context.message.reply(
                        `Info for \`${command.name}\`:\n${"```"}\n${
                        command.aliases ? "Aliases: " + command.aliases.join(", ") + "\n": ""
                        }Syntax:\n    ${
                        command.help.syntax}${"```"}${
                        command.help.long}`
                    );
                } else {
                    throw "Unknown command `" + str + "`.";
                }
            }
        } else if (commandName == "reload") {
            if (commandString == "reload") {
                this.loadCommands();
                context.message.reply("Successfully reloaded all commands.");
            } else {
                let command = commandString.substring(7);
                if (command in this.commands) {
                    this.loadCommand(command);
                    context.message.reply("Successfully reloaded command `" + command + "`.");
                } else {
                    throw "Unknown command `" + command + "`.";
                }
            }
        } else if (commandName in this.commands) {
            let command = this.commands[commandName];
            if (command.permission) {
                let able = false;
                if (command.permission == "mod" || command.permission == "dm") {
                    if (context.member.roles.find(role => role.name == "Mod")) able = true;
                }
                if (command.permission == "dm") {
                    if (context.campaignInfo && (context.id in context.campaignInfo)) {
                        if (context.campaignInfo[context.id].dms.filter(x=>x==context.member.id).length) able = true;
                    } else {
                        if (context.member.roles.find(role => role.name == "DM")) able = true;
                    }
                }
                if (!able) {
                    throw `You're not allowed to use this command. (Requires ${command.permission} or higher.)`;
                }
            }
            let argString = commandString.substring(commandName.length).trim();
            let args = [];
            let argError = -1;
            command.args.forEach(function findArg(arg, index, arr, repeating) {
                if (argError >= 0) return;
                let match = argString.match(CmdHandler.argTypes[arg.type][0]);
                if (match === null) {
                    if (!repeating && !arg.optional) argError = index;
                    return;
                }
                argString = argString.substring(match[0].length);
                args.push(CmdHandler.argTypes[arg.type][1](match[1], context.message));
                // break;
                if (arg.repeat && repeating !== 0) {
                    if (repeating === undefined) {
                        args[index] = [args[index]];
                        findArg(arg, index, arr, arg.repeat);
                    } else {
                        args[index].push(args.pop());
                        findArg(arg, index, arr, repeating - 1);
                    }
                }
            });
            if (argError >= 0) {
                throw `Invalid syntax in argument number ${argError+1}.\n${command.args[argError].help}\nFull command syntax:\n`+'```'+command.help.syntax+'```';
            } else {
                return command.func(context, args);
            }
        } else if (this.dir != "./commands") { // Don't give "unknown command" message unless it's a subcommand.
            throw "Unknown command `" + commandName + "`.";
        }
    }
    getCommandList(permissionlevel) {
        return Object.values(this.commands)
            .filter((cmd,i,s)=>s.indexOf(cmd)==i && permissionlevel>=({[undefined]:0, dm:1,mod:2})[cmd.permission] && cmd.help)
            .map(cmd => cmd.name + ": " + cmd.help.short).join("\n")
    }
}

CmdHandler.argTypes = { // /^()(?:\s+|$)/
    "string": [/^"(.+?)"(?:\s+|$)/, x=>x],
    "word": [/^(\w+)(?:\s+|$)/, x=>x],
    "integer": [/^(\d+)(?:\s+|$)/, Number],
    "integer-string": [/^(\d+)(?:\s+|$)/, x=>x],
    "number": [/^(-?\d+(?:\.\d+)?)(?:\s+|$)/, Number],
    "boolean": [/^(true|t|yes|y|false|f|no|n)(?:\s+|$)/i, x=>["true","t","yes","y"].includes(x.toLowerCase())],
    "color": [/^(#[a-zA-Z0-9]{6})(?:\s+|$)/, x=>x],
    "user": [/^<@(\d+)>(?:\s+|$)/, (x,m)=>m.mentions.members.get(x)],
    "rest": [/^(.+)$/, x=>x],
};

module.exports = CmdHandler;

/* command object structure: {
    name: "String",
    args: [{...},...],
        name: "String",
        type: Enum [
            - string
            - word
            - integer
            - number
            - boolean
            - color
            - user
            - rest
        ],
        repeat: Number, matches until an invalid argument for that type or it has repeated that many times. -1 for infinite.
        optional: Boolean,
        other keys ... depends on type (?)
    tier: Number, TBI
        - 1: ! anyone can use it, little consequence
        e.g. ping
        - 2: !! dms + mods, medium consequence
        e.g. campaign management
        - 3: !!! mod only, major consequence
        e.g. warning management
    func: Function (message, args) {...},
    help: {
        short: "String", short description in command list
        long: "String", detailed description of individual command
        syntax: "String", 
    }
} */