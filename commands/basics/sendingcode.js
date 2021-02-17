const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class SendingCodeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "sendcode",
            aliases: ["sendingcode", "code"],
            group: "basics",
            examples: ["sendcode"],
            memberName: "sendcode",
            description: "This teaches you how to send code!",
        });
    }
    run = async (message) => {
        const { channel, author } = message;
        const getExample = require("./../../help/getExample");

        getExample("sending-code", message, "An example for sending code!");
    };
};
