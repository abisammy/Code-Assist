const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
module.exports = (client) => {
    client.errorNames = new Collection();
    client.errors = new Collection();
    client.errorTriggers = new Collection();
    client.errorIds = new Collection();
    let errorLanguages = client.languages.get("errors-languages");
    for (const language of errorLanguages) {
        const getErrors = (source) =>
            readdirSync(source, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);
        let errors = getErrors(`help/errors/${language}`);

        for (const errorFolder of errors) {
            let errorTrggers = [];
            const error = require(`@help/errors/${language}/${errorFolder}/${errorFolder}-error.js`);
            if (!error.name) {
                throw `help/errors/${language}/${errorFolder}/${errorFolder}-error.js does not have a name!`;
            }
            if (!error.triggers) {
                throw `help/errors/${language}/${errorFolder}/${errorFolder}-error.js does not have any triggers!`;
            }
            if (!error.embedHeading) {
                throw `help/errors/${language}/${errorFolder}/${errorFolder}-error.js does not have a embedHeading!`;
            }
            if (!error.errorDisplayName && error.hidden !== true) {
                throw `help/errors/${language}/${errorFolder}/${errorFolder}-error.js does not have an errorDisplayName!`;
            }

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

            formatedError.language = language;
            formatedError.name = error.name;
            formatedError.triggers = error.triggers;
            formatedError.embedHeading = error.embedHeading;
            formatedError.errorDisplayName = error.errorDisplayName;
            if (error.hidden !== true) {
                formatedError.errorId = error.errorDisplayName
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/'/g, "");
            }

            formatedError.errorFixPath = `help/errors/${language}/${errorFolder}/${errorFolder}-fix.txt`;
            formatedError.hidden = error.hidden;
            formatedError.showLanguage = error.showLanguage;

            client.errors.set(errorFolder, formatedError);
            client.errorIds.set(formatedError.errorId, formatedError.name);

            for (const trigger of formatedError.triggers) {
                let triggerToLowerCase = trigger
                    .toLowerCase()
                    .replace(/ /g, "");

                if (triggerToLowerCase.includes("'")) {
                    let withapostraphyAndWithout = triggerToLowerCase.replace(
                        /'/g,
                        ""
                    );

                    errorTrggers.push(triggerToLowerCase);
                    errorTrggers.push(withapostraphyAndWithout);
                } else {
                    errorTrggers.push(triggerToLowerCase);
                }
            }

            client.errorTriggers.set(errorTrggers, formatedError.name);
        }
        client.errorNames.set(language, errors);
    }
};
