const Discord = require("discord.js");
const fs = require("fs");

module.exports = (client) => {
    client.errors = new Discord.Collection();
    client.once("ready", () => {
        ["errors", "phrases"].forEach((handler) => {
            const command_files = fs

                .readdirSync(`help/${handler}`)
                .filter((file) => file.endsWith(".js"));

            for (const file of command_files) {
                const command = require(`./../../help/${handler}/${file.slice(
                    0,
                    -3
                )}`);
                if (command.name) {
                    let formatedCommand = {
                        name: "",
                        errors: [],
                        description: "",
                        errorDisplayName: "",
                        embedOrNot: false,
                        execute: null,
                    };
                    formatedCommand.name = command.name;

                    for (const error of command.errors) {
                        let errorToLowerCase = error
                            .toLowerCase()
                            .replace(/ /g, "");

                        formatedCommand.errors.push(errorToLowerCase);
                    }

                    command.description
                        ? (formatedCommand.description = command.description)
                        : (formatedCommand.description = null);
                    command.errorDisplayName
                        ? (formatedCommand.errorDisplayName =
                              command.errorDisplayName)
                        : (formatedCommand.errorDisplayName = null);
                    command.embedOrNot
                        ? (formatedCommand.embedOrNot = command.embedOrNot)
                        : (formatedCommand.embedOrNot = false);
                    command.execute
                        ? (formatedCommand.execute = command.execute)
                        : (formatedCommand.execute = null);

                    client.errors.set(formatedCommand.name, formatedCommand);
                } else {
                    continue;
                }
            }
        });
    });
};
