const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
module.exports = (client) => {
    client.exampleNames = new Collection();
    client.examples = new Collection();
    client.exampleIds = new Collection();
    let exampleLanguages = client.languages.get("error-languages");
    for (const language of exampleLanguages) {
        const getExamples = (source) =>
            readdirSync(source, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);
        let examples = getExamples(`help/examples/${language}`);

        for (const exampleFolder of examples) {
            const example = require(`@help/examples/${language}/${exampleFolder}/${exampleFolder}-format.js`);
            if (!example.name) {
                throw `help/examples/${language}/${exampleFolder}/${exampleFolder}-format.js does not have a name!`;
            }
            if (!example.difficulty) {
                throw `help/examples/${language}/${exampleFolder}/${exampleFolder}-format.js does not have any difficulty!`;
            }
            if (!example.embedHeading) {
                throw `help/examples/${language}/${exampleFolder}/${exampleFolder}-format.js does not have a embedHeading!`;
            }
            if (!example.exampleDisplayName) {
                throw `help/examples/${language}/${exampleFolder}/${exampleFolder}-format.js does not have an errorDisplayName!`;
            }

            let validDificulty = ["EASY", "MEDIUM", "HARD"];

            if (!validDificulty.includes(example.difficulty)) {
                throw `help/examples/${language}/${exampleFolder}/${exampleFolder}-format.js's dificulty must be set to EASY, MEDIUM or HARD!`;
            }

            let formatedExample = {
                language: "",
                name: "",
                difficulty: "",
                embedHeading: "",
                exampleDisplayName: "",
                exampleId: "",
                exampleExamplePath: "",
                hidden: false,
            };

            formatedExample.language = language;
            formatedExample.name = example.name;
            formatedExample.difficulty = example.difficulty;
            formatedExample.embedHeading = example.embedHeading;
            formatedExample.exampleDisplayName = example.exampleDisplayName;
            formatedExample.exampleId = example.exampleDisplayName
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/'/g, "");
            formatedExample.exampleExamplePath = `help/examples/${language}/${exampleFolder}/${exampleFolder}-example.txt`;
            formatedExample.hidden = example.hidden;

            client.examples.set(exampleFolder, formatedExample);
            client.exampleIds.set(
                formatedExample.exampleId,
                formatedExample.name
            );
        }
        client.exampleNames.set(language, examples);
    }
};
