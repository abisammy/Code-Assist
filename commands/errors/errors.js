const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

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
    run = (message, args) => {
        const findError = require("@util/findError");
        const { channel, guild } = message;
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("VIEW_CHANNEL")
        ) {
            return;
        }
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        ) {
            const misingPermissiosEmbed = new MessageEmbed()
                .setAuthor(
                    `I am missing the send messages permission in this channel ❌`
                )
                .setColor("#FF0000")
                .setDescription(
                    `Please ask a server administrator to grant me it in this channel!`
                );

            channel.send(misingPermissiosEmbed);
            return;
        }

        let errorLanguages = this.client.languages.get("errors-languages");
        const firstArg = args[0];

        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";

        if (!firstArg) {
            const errorLanguagesEmbed = new MessageEmbed()
                .setAuthor("Languages that I support")
                .setColor("#7289DA");

            let embedText = `Do \`\`${commandPrefix}errors language\`\` to see errors for a specific language! \n\n`;
            for (const errorLanguage of errorLanguages) {
                embedText += `**${errorLanguage}**\n\n`;
            }
            errorLanguagesEmbed.setDescription(embedText);
            return channel.send(errorLanguagesEmbed);
        }

        if (errorLanguages.includes(firstArg)) {
            let findErrorsForFirstArg = this.client.errorNames.get(firstArg);
            const embed = new MessageEmbed()
                .setAuthor(`Errors for ${firstArg}`)
                .setColor("#7289DA");

            let embedText = `To get the code for a specific error, do \`\`${commandPrefix}errors error-id\`\`\n\n`;
            for (const error of findErrorsForFirstArg) {
                let errorFound = this.client.errors.get(error);
                if (errorFound.hidden !== true) {
                    embedText += `**${errorFound.errorDisplayName}**\nID: \`\`${errorFound.errorId}\`\`\n`;
                } else {
                    continue;
                }
            }

            embed.setDescription(embedText);
            return channel.send(embed);
        } else if (this.client.errorIds.get(firstArg.toLowerCase())) {
            let errorCode = this.client.errorIds.get(firstArg.toLowerCase());
            let error = this.client.errors.get(errorCode);
            if (error.hidden === true) {
                return;
            }
            findError(this.client, error.name, message);
        } else {
            const errorEmbed = new MessageEmbed()
                .setAuthor(`I do not support that language or error ❌`)
                .setColor("#FF0000")
                .setDescription(
                    `Please try ${commandPrefix}errors to see my supported languages!`
                );

            return channel.send(errorEmbed);
        }
    };
};
