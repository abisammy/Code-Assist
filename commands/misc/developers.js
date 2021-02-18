// Get message embed and discord.js commando for the command
const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

// Create the command
module.exports = class DeveloperCommand extends Commando.Command {
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
        const { channel } = message;
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("VIEW_CHANNEL")
        ) {
            return;
        }
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        ) {
            const misingPermissiosEmbed = new MessageEmbed()
                .setAuthor(
                    `I am missing the send messages permission in this channel ❌`
                )
                .setColor("#FF0000")
                .setDescription(
                    `Please ask a server administrator to grant me it in this channel!`
                );

            channel.send(misingPermissiosEmbed);
            return;
        }
        // Create the embed and send it
        const devsEmbed = new MessageEmbed()
            .setAuthor(`Here are my developers:`)
            .setColor("#7289DA")
            .setDescription(
                `**abisammy#4749**\n\n**Faint#6669**\n\n\nThis bot is open source for you to use, check out the [github](https://github.com/abisammy/DJS-assist)`
            );

        channel.send(devsEmbed);
    };
};
