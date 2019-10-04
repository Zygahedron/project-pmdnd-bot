let Discord = require('discord.js');
let canvas = require('canvas');

module.exports = {
    name: "color",
    args: [
        {
            help: "`<color ...>` - One or more hex color codes (#XXXXXX)",
            type: 'color',
            repeat: -1
        },
        {
            help: "`[separate images?]` - Each color will be in the same image (false [default]) or a separate image (true)",
            type: 'boolean',
            optional: true
        }
    ],
    func: (context, args) => {
        if (args[1]) {
            args[0].forEach((color, i) => {
                let image = canvas.createCanvas(50, 50);
                let ctx = image.getContext('2d');
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 50, 50);
                context.message.channel.send(color, new Discord.Attachment(image.createPNGStream(), color.substring(1)+".png"));
            });
        } else {
            let image = canvas.createCanvas(50 * args[0].length, 50);
            let ctx = image.getContext('2d');
            args[0].forEach((color, i) => {
                ctx.fillStyle = args[0][i];
                ctx.fillRect(50 * i, 0, 50 * (i + 1), 50);
            });
            context.message.channel.send(args[0].join(", "), new Discord.Attachment(image.createPNGStream(), args[0].join("_").replace(/#/,"") + ".png"));
        }
    },
    help: {
        short: "Produces sample image containing one or more colors",
        long: "This command can be given one or more hex color codes (#XXXXXX), and will produce a 50x50 px image sample of each color. The last argument is optional, and specifies whether multiple requested colors will appear in a single image (false, default) or multiple images, one per color (true).",
        syntax: "$color <color ...> [separate images?]"
    }
};