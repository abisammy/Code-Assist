// Require readdirSync from fs
const { readdirSync } = require("fs");

// Require Collection from dsicrod.js
const { Collection } = require("discord.js");

// Export the function, requireing the client
module.exports = (client) => {
    // Create a new collection. A collection basically works like a javascript map, but it can be used globally, so we can access this anywhere through the bot
    client.languages = new Collection();

    // Once the bot is on
    client.once("ready", () => {
        // Get the two directories, the errors and the examples
        let dirs = ["errors", "examples"];

        // For each of the directories
        for (const dir of dirs) {
            // Create and empty map for the supported languages
            let languages = [];

            // Get all the folders inside of each of the dirs
            let getLanguages = readdirSync(`help/${dir}`, {
                withFileTypes: true,
            })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

            // For each of the langueags
            for (const language of getLanguages) {
                // Push the language to the empty array
                let languageToLowerCase = language.toLowerCase();
                languages.push(languageToLowerCase);
            }

            // Set the collection, for the dir and the supported languages
            client.languages.set(`${dir}-languages`, languages);
        }

        // Require util > loadErrors.js and run it
        const loadErrors = require("@util/loadErrors");
        loadErrors(client);

        // Require util > loadExamples.js and run it
        const loadExamples = require("@util/loadExamples");
        loadExamples(client);
    });
};
