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
        const { author, channel } = message;

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
