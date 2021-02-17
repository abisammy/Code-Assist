// Require the collection to create a map for the different examples
const { Collection } = require("discord.js");

// Require fs to find the files
const fs = require("fs");

// Get the client so we can set the examples as a map
module.exports = (client) => {
    // Create the empty map
    client.examples = new Collection();

    // Once the bot is online
    client.once("ready", () => {
        // Find the example txt files in help/examples
        const example_files = fs
            .readdirSync(`help/examples`)
            .filter((file) => file.endsWith("example.txt"));

        // For each file that it found
        for (const file of example_files) {
            // Remove the example.txt from the file
            let fileName = file.slice(0, -11);

            // Set the example name in the map
            client.examples.set(fileName, fileName.replace(/-/g, ""));
        }
    });
};
