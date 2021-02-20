// Get readditSync (to find the files and folders) from fs
const { readdirSync } = require("fs");

// Get collections from discord.js
const { Collection } = require("discord.js");

// Export the function to load the errors, requiring the client
module.exports = (client) => {
    // Create four discord.js collections, these basically work as javascript maps, but work globally throughout the bot. This is useful as we can then find any of these keys anywhere in these files
    client.errorNames = new Collection();
    client.errors = new Collection();
    client.errorTriggers = new Collection();
    client.errorIds = new Collection();

    // Get the errorLanguages, which we set in features > loadLanguages.js
    let errorLanguages = client.languages.get("errors-languages");

    // FOr every supported language
    for (const language of errorLanguages) {
        // Use this function to find all the folders inside each language, for example help > errors > discord.js is a language and help > errors > discord.js > botisnotdefined is an error
        const getErrors = (source) =>
            readdirSync(source, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

        // Get the errors of each language
        let errors = getErrors(`help/errors/${language}`);

        // For all the error folders we find in each error language
        for (const errorFolder of errors) {
            // Create an empty map for the triggers
            let errorTrggers = [];

            // Get the error file which defines how the error will work (name, triggers etc)
            const error = require(`@help/errors/${language}/${errorFolder}/${errorFolder}-error.js`);

            // Check if the error has the required name, triggers, embedHeading and display name
            if (!error.triggers) {
                throw `help/errors/${language}/${errorFolder}/${errorFolder}-error.js does not have any triggers!`;
            }
            if (!error.embedHeading) {
                throw `help/errors/${language}/${errorFolder}/${errorFolder}-error.js does not have a embedHeading!`;
            }
            if (!error.errorDisplayName && error.hidden !== true) {
                throw `help/errors/${language}/${errorFolder}/${errorFolder}-error.js does not have an errorDisplayName!`;
            }

            // Create a base error
            let formatedError = {
                language: "",
                name: "",
                triggers: [],
                embedHeading: "",
                errorDisplayName: "",
                errorId: "",
                errorFixPath: "",
                hidden: false,
                showLanguage: false,
            };

            // Set all the base errors properties to the errors properties
            formatedError.language = language;
            formatedError.name = errorFolder;
            formatedError.triggers = error.triggers;
            formatedError.embedHeading = error.embedHeading;
            formatedError.errorDisplayName = error.errorDisplayName;
            if (error.hidden !== true) {
                formatedError.errorId = error.errorDisplayName
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/'/g, "");
            }

            // The errorFixPath is a custom property we set here which has the path for the txt file where we solve the error. We do this here as we can map it to the error and get it later if we need to find the fix
            formatedError.errorFixPath = `help/errors/${language}/${errorFolder}/${errorFolder}-fix.txt`;
            formatedError.hidden = error.hidden;
            formatedError.showLanguage = error.showLanguage;

            // Set the error in the errors map
            client.errors.set(errorFolder, formatedError);

            // Set the valid errorIds in the errorIds map, and the name to find it in the errors map
            client.errorIds.set(formatedError.errorId, errorFolder);

            // For all the triggers of the errors triggers
            for (const trigger of formatedError.triggers) {
                // Set the trigger to lower case
                let triggerToLowerCase = trigger
                    .toLowerCase()
                    .replace(/ /g, "");

                // If the trigger includes ' create an extra trigger without it
                if (triggerToLowerCase.includes("'")) {
                    let withapostraphyAndWithout = triggerToLowerCase.replace(
                        /'/g,
                        ""
                    );

                    // Push any these to the errorTrigersMap
                    errorTrggers.push(triggerToLowerCase);
                    errorTrggers.push(withapostraphyAndWithout);
                } else {
                    // push it to the error triggers map
                    errorTrggers.push(triggerToLowerCase);
                }

                /* Im just going to explain why I did the function from line 93 to line 114.
                This function is very handy in two ways.
                Firstly it converts this for example "Cannot read property execute of undefined"
                to "cannotreadpropertyexecuteofundefined"
                That is good as with any capitisation or spacing, the bot will still be able to find a trigger

                The second reason that is good, is if we want to do "'bot' is not defined" in the error triggers of the error file
                The bot will automatically create a second trigger with "bot is not defined", so it saves a lot of heavy lifting for us
                */
            }

            // Push the error triggers to the collection, and the name so we can find it in the errors collection
            client.errorTriggers.set(errorTrggers, errorFolder);
        }

        // Get all the errors for each language
        client.errorNames.set(language, errors);
    }
};
