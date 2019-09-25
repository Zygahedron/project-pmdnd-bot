let Discord = require('discord.js');
let canvas = require('canvas');

module.exports = {
    name: "purge",
    args: [
        {
            help: "`<count|` - The number of messages to delete, excluding the command.\n`|id>` - The id of the first message to remove.",
            type: 'integer-string'
        },
        {
            help: "`[user]` - Optionally only delete messages from this user.",
            type: 'user',
            optional: true
        }
    ],
    func: (context, args) => {
        let message = context.message;
        if (+args[0] > 100) { // id
            message.channel.fetchMessage(""+args[0]).then(m=>{
                message.channel.fetchMessages({after: ""+args[0]}).then(messages=>{
                    if (args[1]) {
                        messages = messages.filter(m=>m.author.id == args[1].id);
                    }
                    messages = messages.filter(m=>m.id!=message.id);
                    message.channel.bulkDelete(messages).then(deleted=>{
                        message.reply(`Purged ${deleted.size} messages.`);
                    });
                });
            }).catch(e=>{
                message.reply("There is no message with that id in this channel.");
            });
        } else if (!args[1]) { // count, no user
            message.channel.fetchMessages({limit: +args[0], before: message.id}).then(messages=>{
                message.channel.bulkDelete(messages).then(deleted=>{
                    message.reply(`Purged ${deleted.size} messages.`);
                });
            });
        } else { // count + user, needs more complicated logic
            let matching = new Discord.Collection();
            message.channel.fetchMessages({limit: args[0]*5}).then(function fetched(messages) { // nesting is necessary
                matching = messages.filter(m=>m.author.id==args[1].id).concat(matching);
                if (matching.size < args[0] && messages.size > 0) {
                    message.channel.fetchMessages({before: (messages.first() || {}).id, limit: args[0]*5}).then(fetched);
                } else {
                    message.channel.bulkDelete(matching.last(args[0])).then(deleted=>{
                        message.reply(`Purged ${deleted.size} messages.`);
                    });
                }
            });
        }
    },
    help: {
        short: "Deletes recent messages",
        long: "Deletes recent messages starting by count or message id, and optionally filtered by user.",
        syntax: "!purge <count|id> [user]"
    },
    permission: "mod",
};