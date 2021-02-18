const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

// Import the client
module.exports = (client) => {
    let errorLanguages = [];
    let exampleLanguages = [];

    client.languages = new Collection();
    // When the client is ready
    client.once("ready", () => {
        let dirs = ["errors", "examples"];

        for (const dir of dirs) {
            let getLanguages = readdirSync(`help/${dir}`, {
                withFileTypes: true,
            })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

            for (const language of getLanguages) {
                if (dir === "errors") {
                    errorLanguages.push(language);
                } else if (dir === "examples") {
                    exampleLanguages.push(language);
                } else {
                    throw new Error("loadArticles has not been updated!");
                }
            }
        }
        client.languages.set("error-languages", errorLanguages);
        client.languages.set("example-languages", exampleLanguages);

        const loadErrors = require("@util/loadErrors");
        loadErrors(client);

        const loadExamples = require("@util/loadExamples");
        loadExamples(client);
    });
};
