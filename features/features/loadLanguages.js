const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

// Import the client
module.exports = (client) => {
    client.languages = new Collection();
    // When the client is ready
    client.once("ready", () => {
        let dirs = ["errors", "examples"];

        for (const dir of dirs) {
            let languages = [];
            let getLanguages = readdirSync(`help/${dir}`, {
                withFileTypes: true,
            })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

            for (const language of getLanguages) {
                if (dir === "errors") {
                    languages.push(language);
                } else if (dir === "examples") {
                    languages.push(language);
                } else {
                    throw new Error("loadArticles has not been updated!");
                }
            }
            client.languages.set(`${dir}-languages`, languages);
        }

        const loadErrors = require("@util/loadErrors");
        loadErrors(client);

        const loadExamples = require("@util/loadExamples");
        loadExamples(client);
    });
};
