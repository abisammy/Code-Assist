// require commando for the command
const { Command } = require("discord.js-commando");

// Create a commando command
module.exports = class SimGuildCommand extends Command {
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

        // simulate the bot being added to a server
        this.client.emit("guildCreate", guild);
    };
};
