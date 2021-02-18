// Require the collection to create a map for the different examples
const { Collection } = require("discord.js");

// Require fs to find the files
const fs = require("fs");

// Get the client so we can set the examples as a map
module.exports = (client) => {
    // Create the empty map
    client.errors = new Collection();

    // Once the bot is online
    client.once("ready", () => {
        // For each of the errors or phrases in the help/phrases or help/examples
        ["errors", "phrases"].forEach((handler) => {
            // Find the fix.txt files in these folders
            const error_files = fs
                .readdirSync(`help/${handler}`)
                .filter((file) => file.endsWith(".js"));

            // For each file that it has found
            for (const file of error_files) {
                // Find the file and cut off the fix
                const error = require(`@help/${handler}/${file.slice(0, -3)}`);

                // If there is a name provided in the file
                if (error.name) {
                    // Create a default error
                    let formatedError = {
                        name: "",
                        errors: [],
                        description: "",
                        errorDisplayName: "",
                        embedOrNot: false,
                        execute: null,
                    };

                    // Set the name to the error name
                    formatedError.name = error.name;

                    // For the error, of the trigers
                    for (const errorTrigger of error.errors) {
                        let errorToLowerCase = errorTrigger
                            .toLowerCase()
                            .replace(/ /g, "");

                        // Push the value to a string, so now all triggers will be a string
                        formatedError.errors.push(errorToLowerCase);
                    }

                    // Set the description to the description if it has one
                    error.description
                        ? (formatedError.description = error.description)
                        : (formatedError.description = null);

                    // Set the display name to the display name if it has one
                    error.errorDisplayName
                        ? (formatedError.errorDisplayName =
                              error.errorDisplayName)
                        : (formatedError.errorDisplayName = null);

                    // If embedOrNot is true set the default one to true
                    error.embedOrNot
                        ? (formatedError.embedOrNot = error.embedOrNot)
                        : (formatedError.embedOrNot = false);
                    error.execute
                        ? (formatedError.execute = error.execute)
                        : (formatedError.execute = null);

                    // Finally set the map, to the formated error
                    client.errors.set(formatedError.name, formatedError);
                } else {
                    // If there wasnt an error name, continue searching for files
                    continue;
                }
            }
        });
    });
};
