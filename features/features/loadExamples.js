const Discord = require("discord.js");
const fs = require("fs");

module.exports = (client) => {
    client.examples = new Discord.Collection();
    client.once("ready", () => {
        const example_files = fs

            .readdirSync(`help/examples`)
            .filter((file) => file.endsWith("example.txt"));

        for (const file of example_files) {
            let fileName = file.slice(0, -11);
            client.examples.set(fileName, fileName.replace(/-/g, ""));
        }
    });
};
