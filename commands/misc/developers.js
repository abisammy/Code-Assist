// Get message embed and discord.js commando for the command
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

// Create the command
module.exports = class DeveloperCommand extends Command {
    constructor(client) {
        super(client, {
            name: "developers",
            aliases: ["devs"],
            group: "misc",
            memberName: "developers",
            description: "Shows the original creators of the bot",
        });
    }
    run = async (message) => {
        // Destructure the channel from the message
        const { channel, guild } = message;

        // Make sure we have the embed links permission in the channel
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }

        // Create the embed and send it
        const devsEmbed = new MessageEmbed()
            .setAuthor(`Here are my developers:`)
            .setColor("#7289DA")
            .setDescription(
                `**abisammy#4749**\n\n**Faint#6669**\n\n\nThis bot is open source for you to use, check out the [github](https://github.com/abisammy/DJS-assist)\n\n**Links**\n[github](https://github.com/abisammy/DJS-assist) **|** [apply to become a writer](https://forms.gle/fYWkeRuEX16zX8SHA) **|** [support server](https://discord.gg/QJcJ3McTQC)`
            );

        channel.send(devsEmbed);
    };
};
