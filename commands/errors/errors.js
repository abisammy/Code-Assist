// Require commando for the command
const { Command } = require("discord.js-commando");

// require MessageEmbed from discord.js
const { MessageEmbed } = require("discord.js");

// create the command
module.exports = class ErrorsCommand extends Command {
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
    run = (message, args) => {
        // require findError.js from util > findError.js
        const findError = require("@util/findError");

        // Destrucuture the channel and the guild from the message
        const { channel, guild } = message;

        // Make sure we have the embed links permission in th channel
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }

        // Get the error languages that the errors support
        let errorLanguages = this.client.languages.get("errors-languages");

        // Define the first argument for later
        const firstArg = args[0];

        // Get the command prefix whether the command was sent in DM's or not
        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";

        // If the user didnt provide a first argument, then send all the languages that errors support
        if (!firstArg) {
            // create the embed
            const errorLanguagesEmbed = new MessageEmbed()
                .setAuthor("Languages that I support")
                .setColor("#7289DA");

            // Create the text for the embed
            let embedText = `Do \`\`${commandPrefix}errors language\`\` to see errors for a specific language! \n\n`;

            // For each of the languages that the errors support add it to the emebd text
            for (const errorLanguage of errorLanguages) {
                embedText += `**${errorLanguage}**\n\n`;
            }

            // Set the embeds description to the embedText
            errorLanguagesEmbed.setDescription(embedText);

            // send the embed
            return channel.send(errorLanguagesEmbed);
        }

        // If the user provided a valid language then
        if (errorLanguages.includes(firstArg.toLowerCase())) {
            // find the errors for the language provided in the first argument
            let findErrorsForFirstArg = this.client.errorNames.get(
                firstArg.toLowerCase()
            );

            // Create an embed
            const embed = new MessageEmbed()
                .setAuthor(`Errors for ${firstArg}`)
                .setColor("#7289DA");

            // Create embedText for the embed
            let embedText = `To get the code for a specific error, do \`\`${commandPrefix}errors error-id\`\`\n\n`;

            // For each of the supported errors
            for (const error of findErrorsForFirstArg) {
                // Find the error in the client.errors colection
                let errorFound = this.client.errors.get(error);

                // If the error is not hidden add it
                if (errorFound.hidden !== true) {
                    embedText += `**${errorFound.errorDisplayName}**\nID: \`\`${errorFound.errorId}\`\`\n`;

                    // However if it is hidden, continue finding errors
                } else {
                    continue;
                }
            }

            // set the embeds description to the embedText
            embed.setDescription(embedText);

            // send the embed
            return channel.send(embed);

            // However if we find the error in the errorIds
        } else if (this.client.errorIds.get(firstArg.toLowerCase())) {
            // get the errorCode
            let errorCode = this.client.errorIds.get(firstArg.toLowerCase());

            // get the error
            let error = this.client.errors.get(errorCode);

            // If the error is hidden then return
            if (error.hidden === true) {
                return;
            }

            // Use findError.js to find the error
            findError(this.client, error.name, message);

            // If we did not find a language or error for the first argument
        } else {
            // Create an embed
            const errorEmbed = new MessageEmbed()
                .setAuthor(`I do not support that language or error ❌`)
                .setColor("#FF0000")
                .setDescription(
                    `Please try ${commandPrefix}errors to see my supported languages!`
                );

            // send the embed
            return channel.send(errorEmbed);
        }
    };
};
