const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
module.exports = class ContributeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "contribute",
            group: "misc",
            memberName: "contribute",
            description: "Learn how to contribute to the bot!",
        });
    }
    run = async (message, args) => {
        const { channel, guild } = message;
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

        const contirbuteEmbed = new MessageEmbed()
            .setAuthor(`Use this for to contribute to the bot`)
            .setColor("#7289DA")
            .setDescription(
                `**Writer application**\n\nhttps://forms.gle/fYWkeRuEX16zX8SHA\n\n\n**Links**\n[github](https://github.com/abisammy/DJS-assist) **|** [apply to become a writer](https://forms.gle/fYWkeRuEX16zX8SHA) **|** [support server](https://discord.gg/QJcJ3McTQC)`
            );

        channel.send(contirbuteEmbed);
    };
};
