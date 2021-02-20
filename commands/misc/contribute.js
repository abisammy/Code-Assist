// Get MessageEmbed and Commando for the command
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

// Create the command
module.exports = class ContributeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "contribute",
            group: "misc",
            memberName: "contribute",
            description: "Learn how to contribute to the bot!",
        });
    }
    run = async (message, args) => {
        // destrucuture the channel and the guild from the command
        const { channel, guild } = message;

        // make sure we have the embed links permission in the channel
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }

        // Create an embed and send it
        const contirbuteEmbed = new MessageEmbed()
            .setAuthor(`Use this for to contribute to the bot`)
            .setColor("#7289DA")
            .setDescription(
                `**Writer application**\n\nhttps://forms.gle/fYWkeRuEX16zX8SHA\n\n\n**Links**\n[github](https://github.com/abisammy/DJS-assist) **|** [apply to become a writer](https://forms.gle/fYWkeRuEX16zX8SHA) **|** [support server](https://discord.gg/QJcJ3McTQC)`
            );

        channel.send(contirbuteEmbed);
    };
};
