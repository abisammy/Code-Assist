// Not going to take credit, this is the default discord.js commando ping command modified into an embed

const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
module.exports = class PingCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "ping",
            group: "util",
            aliases: ["latency", "apiinfo"],
            memberName: "ping",
            description: "Measures the ping of the bot",
        });
    }
    run = async (message, args) => {
        const { author, channel, guild } = message;
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
        const pingMsg = await message.reply("Pinging...");
        const pingEmbed = new MessageEmbed()
            .setAuthor(`Ping pong 🏓`)
            .setDescription(
                `
            ${channel.type !== "dm" ? `${author},` : ""}
            Pong! The message round-trip took \`\`${
                (pingMsg.editedTimestamp || pingMsg.createdTimestamp) -
                (message.editedTimestamp || message.createdTimestamp)
            }\`\`ms.
            ${
                this.client.ws.ping
                    ? `The heartbeat ping is \`\`${Math.round(
                          this.client.ws.ping
                      )}\`\`ms.`
                    : ""
            }
        `
            )
            .setColor("#7289DA");
        pingMsg.delete();
        channel.send(pingEmbed);
    };
};
