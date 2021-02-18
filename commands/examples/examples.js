// Get commando to create a new command
const Commando = require("discord.js-commando");

// Get embeds, and util so we can split the embed from discord.js
const { MessageEmbed, Util } = require("discord.js");

// Create the commando command
module.exports = class ExamplesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "examples",
            group: "examples",
            aliases: ["eg", "example"],
            examples: ["examples", "example avatar-command"],
            memberName: "examples",
            description: "Shows examples of code for you to add to your bot!",
            argsType: "multiple",
        });
    }
    run = async (message, args) => {
        const findExample = require("@util/findExample");
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
        let exampleLanguages = this.client.languages.get("examples-languages");
        const firstArg = args[0];

        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";

        if (!firstArg) {
            const exampleLanguagesEmbed = new MessageEmbed()
                .setAuthor("Languages that I support")
                .setColor("#7289DA");

            let embedText = `Do \`\`${commandPrefix}examples language\`\` to see errors for a specific language! \n\n`;
            for (const exampleLanguage of exampleLanguages) {
                embedText += `**${exampleLanguage}**\n\n`;
            }
            exampleLanguagesEmbed.setDescription(embedText);
            return channel.send(exampleLanguagesEmbed);
        }

        if (exampleLanguages.includes(firstArg)) {
            let findExampleForFirstArg = this.client.exampleNames.get(firstArg);
            if (!findExampleForFirstArg[0]) {
                const errorEmbed = new MessageEmbed()
                    .setAuthor(
                        `No examples found for that programming language`
                    )
                    .setColor("#7289DA")
                    .setDescription(`Hopfully we can add some soon!`);

                return channel.send(errorEmbed);
            }
            const embed = new MessageEmbed()
                .setAuthor(`Errors for ${firstArg}`)
                .setColor("#7289DA");

            let embedText = `To get the code for a specific example, do \`\`${commandPrefix}examples example-id\`\`\n\n`;
            for (const example of findExampleForFirstArg) {
                let exampleFound = this.client.examples.get(example);
                if (exampleFound.hidden !== true) {
                    embedText += `**${exampleFound.exampleDisplayName}**\nID: \`\`${exampleFound.exampleId}\`\`\n`;
                } else {
                    continue;
                }
            }

            embed.setDescription(embedText);
            return channel.send(embed);
        } else if (this.client.exampleIds.get(firstArg.toLowerCase())) {
            let exampleCode = this.client.exampleIds.get(
                firstArg.toLowerCase()
            );
            let example = this.client.examples.get(exampleCode);
            if (example.hidden === true) {
                return;
            }
            findExample(this.client, example.name, message);
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
