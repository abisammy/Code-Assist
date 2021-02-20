// Get readdirSync from fs to find all the example folders
const { readdirSync } = require("fs");

// Get the collection from dsicord, to create multople collections
const { Collection } = require("discord.js");

// Export the function, requiring the client
module.exports = (client) => {
    // Create the three new discord.js collections. Collections work like javascript maps, except you can use the globally, so we can use them anywhere throughout the bot
    client.exampleNames = new Collection();
    client.examples = new Collection();
    client.exampleIds = new Collection();

    // Get the languages we use for examples, which we set in features > features > loadLanguages.js
    let exampleLanguages = client.languages.get("examples-languages");

    // For each of the languages we support for the examples
    for (const language of exampleLanguages) {
        // Create a function to get all the folders in a folder we provide
        const getExamples = (source) =>
            readdirSync(source, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

        // Get all the example folders for each folder in the language, this would be for example help > examples > discord.js is the language and help > examples > discord.js > kickcommand is the example folder
        let examples = getExamples(`help/examples/${language}`);

        // For each of the exampleFolders in the examples that we get
        for (const exampleFolder of examples) {
            // Find the example format file
            const example = require(`@help/examples/${language}/${exampleFolder}/${exampleFolder}-format.js`);

            // Make surew we have each of the required fields in the exmaples format file
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

            // Create a base exmaple for the examples
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

            // Set the base examples fields, to the examples fields
            formatedExample.language = language;
            formatedExample.name = exampleFolder;
            formatedExample.difficulty = example.difficulty;
            formatedExample.embedHeading = example.embedHeading;
            formatedExample.exampleDisplayName = example.exampleDisplayName;
            formatedExample.exampleId = example.exampleDisplayName
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/'/g, "");

            // exampleExamplePath is a custom property we set here to find the .txt file containing the text for the actual example, which we can use fs to find later
            formatedExample.exampleExamplePath = `help/examples/${language}/${exampleFolder}/${exampleFolder}-example.txt`;
            formatedExample.hidden = example.hidden;

            // Set the example in the examples collection
            client.examples.set(exampleFolder, formatedExample);

            // Set the exampleId and the name we could find in the examples collection
            client.exampleIds.set(formatedExample.exampleId, exampleFolder);
        }

        // set all the examples for the languages
        client.exampleNames.set(language, examples);
    }
};
