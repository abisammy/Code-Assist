const Commando = require("discord.js-commando");

module.exports = class SimGuildCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "simguild",
            group: "dev only",
            memberName: "simguild",
            description: "Simulate the bot being added to a server!",
            ownerOnly: true,
        });
    }
    run = async (message) => {
        const { guild } = message;
        this.client.emit("guildCreate", guild);
    };
};
