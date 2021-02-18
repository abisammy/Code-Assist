// Get commando to create a new command
const Commando = require("discord.js-commando");

// Get embeds, and util so we can split the embed from discord.js
const { MessageEmbed, Util } = require("discord.js");

// Create the commando command
module.exports = class ErrorsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "errors",
            group: "errors",
            aliases: ["error", "err", "errs"],
            examples: ["errors", "error cannot-find-module-discord.js"],
            memberName: "errors",
            description: "Shows the errors and a possible explanation for each",
            argsType: "multiple",
        });
    }
    run = async (message, args) => {
        // Destructure the guild and the channel from the message
        const { guild, channel } = message;

        // Get the command prefix, if the message was ran in a server of DM's
        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";

        // Get the first argument
        const firstArg = args[0];

        // If they didnt provide a first argument then send them all the examples
        if (!firstArg) {
            // Create an embed
            const errorsEmbed = new MessageEmbed()
                .setAuthor(`Possible errors that you may find here`)
                .setColor("#7289DA");

            // Add this text to the description
            let errorEmbedText = `**To find out the fix for a specific error, copy the ID and do \`\`${commandPrefix}errors error-id\`\`\n\n**`;

            // For every error in the errors map which we set in loadErrors.js
            for (const error of this.client.errors) {
                // Get the error ID
                let errorId = error[1].errorDisplayName;

                // If the error ID is not null, so we want this error to appear on the errors command
                if (errorId !== null) {
                    // Add it to the embed text
                    errorEmbedText += `\n**${
                        error[1].errorDisplayName
                    }**\nID: \`\`${errorId
                        .toLowerCase()
                        .replace(/ /g, "-")}\`\`\n`;
                } else {
                    // However if the error ID was null, continue finding errors
                    continue;
                }
            }

            // Set the description of the errors embed to the error embed text and send the embed
            errorsEmbed.setDescription(errorEmbedText);
            channel.send(errorsEmbed);
        } else {
            // However if they did provide an error then create two empty strings to map the error code that the user uses, and the error code that the code uses
            let idString = [];
            let errorNameString = [];

            // For every error in the errors map which we set in loadErrors.js
            for (const error of this.client.errors) {
                // Get the error ID
                let errorId = error[1].errorDisplayName;

                // If the error ID is not null, which means we want it to appear in the errors command
                if (errorId !== null) {
                    // Push the ID for the user and the code to the string
                    idString.push(errorId.toLowerCase().replace(/ /g, "-"));
                    errorNameString.push(error[0]);
                } else {
                    // However if the error ID for the user was null keep on finding errors in the map
                    continue;
                }
            }

            // If the ID string which we mapped earlier includes the first argument provided by the user
            if (idString.includes(firstArg)) {
                // Destructure the author from the message
                const { author } = message;

                // Get the index value of the ID string
                var findIndex = idString.indexOf(firstArg);

                /* Get the text of the fix. We use the index value 
                of the user ID string to find the ID for the error that the bot uses*/
                const getFix = require("./../../help/getFix").value;
                let error = getFix(errorNameString[findIndex]);

                // Split the embed in two if it is too long
                const [first, ...rest] = Util.splitMessage(error, {
                    maxLength: 2048,
                });

                // Create the first embed
                const exampleEmbed = new MessageEmbed()
                    .setAuthor("Results for your error")
                    .setColor("#7289DA")
                    .setDescription(first);

                // If the channel was in a guild tell the user to check their DM's
                if (channel.type !== "dm") {
                    message.reply("Check your DMs!");
                }

                // Max characters were not reached so there is no "rest" in the array
                if (!rest.length) {
                    // Send just the embed with the first element from the array
                    return author.send(exampleEmbed).catch((error) => {
                        return;
                    });
                }

                // However max characters here was reached, so still send the first embed
                await author.send(exampleEmbed).catch((error) => {
                    return;
                });

                // Remove the seconds embed author, and change the second embeds description
                exampleEmbed.setAuthor(" ");
                exampleEmbed.setDescription(rest);

                // Send the user the second embed
                return author.send(exampleEmbed).catch((error) => {
                    return;
                });
            } else {
                // However if the user provided an invalid error ID tell the user that they did
                const errorEmbed = new MessageEmbed()
                    .setAuthor(`You provided me with an invalid error code ❌`)
                    .setColor("#FF0000");

                return channel.send(errorEmbed);
            }
        }
    };
};
