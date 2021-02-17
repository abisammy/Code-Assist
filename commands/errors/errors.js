const Commando = require("discord.js-commando");
const { MessageEmbed, Util } = require("discord.js");

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
        const { guild, channel } = message;
        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";
        const firstArg = args[0];
        if (!firstArg) {
            const errorsEmbed = new MessageEmbed()
                .setAuthor(`Possible errors that you may find here`)
                .setColor("#7289DA");

            let errorEmbedText = `**To find out the fix for a specific error, copy the ID and do \`\`${commandPrefix}errors error-id\`\`\n\n**`;

            for (const error of this.client.errors) {
                let errorId = error[1].errorDisplayName;
                if (errorId !== null) {
                    errorEmbedText += `\n**${
                        error[1].errorDisplayName
                    }**\nID: \`\`${errorId
                        .toLowerCase()
                        .replace(/ /g, "-")}\`\`\n`;
                } else {
                    continue;
                }
            }

            errorsEmbed.setDescription(errorEmbedText);
            channel.send(errorsEmbed);
        } else {
            let idString = [];
            let errorNameString = [];

            for (const error of this.client.errors) {
                let errorId = error[1].errorDisplayName;
                if (errorId !== null) {
                    idString.push(errorId.toLowerCase().replace(/ /g, "-"));
                    errorNameString.push(error[0]);
                } else {
                    continue;
                }
            }
            if (idString.includes(firstArg)) {
                const { author } = message;
                var findIndex = idString.indexOf(firstArg);

                const getFix = require("./../../help/getFix").value;
                let error = getFix(errorNameString[findIndex]);
                const [first, ...rest] = Util.splitMessage(error, {
                    maxLength: 2048,
                });
                // return data.replace(/(\r\n|\n|\r)/gm, "\n");
                const exampleEmbed = new MessageEmbed()
                    .setAuthor("Results for your error")
                    .setColor("#7289DA")
                    .setDescription(first);

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

                await author.send(exampleEmbed).catch((error) => {
                    return;
                });

                exampleEmbed.setAuthor(" ");
                exampleEmbed.setDescription(rest);

                return author.send(exampleEmbed).catch((error) => {
                    return;
                });
            } else {
                const errorEmbed = new MessageEmbed()
                    .setAuthor(`You provided me with an invalid error code ❌`)
                    .setColor("#FF0000");

                return channel.send(errorEmbed);
            }
        }
    };
};
