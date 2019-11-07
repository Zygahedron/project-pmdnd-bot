require('dotenv').config();

const Discord = require('discord.js');
const bot = new Discord.Client();

const fs = require('fs');

const CmdHandler = require("./cmd-handler.js");
const jsonProxy = require('./jsonproxy.js');

const awaitingConfirmation = {};

const can = require('./can.json');

// let _hiddenPermissionsSaveTimeout;
// const hiddenPermissions = new Proxy(JSON.parse(fs.readFileSync("hiddenpermissions.json", 'utf8')),{
//     set (obj, key, val) {
//         obj[key] = val;
//         if (_hiddenPermissionsSaveTimeout) clearTimeout(_hiddenPermissionsSaveTimeout);
//         _hiddenPermissionsSaveTimeout = setTimeout(() => {
//             fs.writeFileSync("hiddenpermissions.json", JSON.stringify(obj));
//         }, 5000);
//     },
//     deleteProperty (obj, key) {
//         delete obj[key];
//         console.log("Setting internally.");
//         if (_hiddenPermissionsSaveTimeout) clearTimeout(_hiddenPermissionsSaveTimeout);
//         _hiddenPermissionsSaveTimeout = setTimeout(() => {
//             fs.writeFileSync("hiddenpermissions.json", JSON.stringify(obj));
//         }, 5000);
//     }
// });

const cmd = new CmdHandler("./commands");
const pw = jsonProxy("password.json");

bot.on('ready', () => {
    try {
        bot.guilds.get(pw.guild).channels.get(pw.channel).fetchMessage(pw.message).then(msg=>{
            let match = msg.content.match(new RegExp(pw.pattern))
            if (match && match[1]) {
                pw.password = match[1].toLowerCase();
                console.log("Password is set to `" + pw.password + "`.");
            } else {
                console.log("Could not get password. Password configuration might be invalid.")
            }
        });
    } catch (e) {
        console.log("Could not get password. Password configuration might be invalid.")
    }
    if (!("pattern" in pw)) {
        pw.pattern = "No password pattern. (Please set one.)"
    }
    console.log("Ready.");
});

bot.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") {
        let member = bot.guilds.get(pw.guild).members.get(message.author.id)
        let content = message.content.toLowerCase();
        if (content[0] == "$") content = content.substr(1);
        if (!(member.roles.find(role => role.name == "Active") || member.roles.find(role => role.name == "Spectator"))) {
            if (content == pw.password) {
                member.addRole(member.guild.roles.find(role => role.name == "Active"));
                console.log("Gave Active role to " + message.author.username + ".");
                message.reply("Password accepted. Welcome!\n\nYou currently have the Active role, which means you will recieve pings when new campaigns open.\nTo turn this off, use the `$spectator` command to switch to the Spectator role.\nIf you change your mind at any time, use the `$active` command to enable pings again.");
            } else {
                message.reply("Please read the rules more closely.");
            }
            return;
        }
    }
    if (message.content[0] == "$") {
        let context = {bot, message, awaitingConfirmation, cmd, member: message.member};
        try {
            cmd.runCommand(context, message.content.substring(1).trim());
        } catch (e) {
            message.channel.send(e.toString());
            console.log(e);
        }
    }
    if (message.content.includes(can.link1) || message.content.includes(can.link2) ||
        message.attachments.find(x=>x.filename == can.file1 || x.filename == can.file2)
    ) {
        message.delete();
    }
});

bot.on('messageUpdate', (oldMessage, message) => {
    if (message.id == pw.message) {
        let match = message.content.match(new RegExp(pw.pattern))
        if (match && match[1]) {
            pw.password = match[1].toLowerCase();
            console.log("Password is set to `" + pw.password + "`.");
        } else {
            console.log("Could not get password. Password configuration might be invalid.")
        }
    }
});

bot.login();

process.on('SIGINT', () => {
    console.log("Shutting down.");
    bot.destroy();
    process.exit();
});
process.on('SIGTERM', () => {
    console.log("Shutting down.");
    bot.destroy();
    process.exit();
});
process.on("uncaughtException", (err)=>{
    console.error(err);
    bot.destroy();
    process.exit();
});