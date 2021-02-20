// Get commando to create a new command
const { Command } = require("discord.js-commando");

// Get embeds, and util so we can split the embed from discord.js
const { MessageEmbed } = require("discord.js");

// Create the commando command
module.exports = class ExamplesCommand extends Command {
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
        // require findexample.js in util > findExample.js
        const findExample = require("@util/findExample");

        // Destructrue the channel and the guild for the message
        const { channel, guild } = message;

        // make sure we have the embed links permission in the channel
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }

        // Get the languages that the examples support. We set this in features > features > loadLanguages.js
        let exampleLanguages = this.client.languages.get("examples-languages");

        // Define the first argument for later use
        const firstArg = args[0];

        // get the command prefix, wheteher the command was ran in DM's or in a server
        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";

        // if they didnt provide a first argument, tell them the languages we have examples for
        if (!firstArg) {
            // Create a embed
            const exampleLanguagesEmbed = new MessageEmbed()
                .setAuthor("Languages that I support")
                .setColor("#7289DA");

            // Create text for the embed
            let embedText = `Do \`\`${commandPrefix}examples language\`\` to see errors for a specific language! \n\n`;

            // For each of the languages add it to the embed
            for (const exampleLanguage of exampleLanguages) {
                embedText += `**${exampleLanguage}**\n\n`;
            }

            // Set the embeds description to the embedText
            exampleLanguagesEmbed.setDescription(embedText);

            // Send the embed
            return channel.send(exampleLanguagesEmbed);
        }

        // If the first argument was a supported language then
        if (exampleLanguages.includes(firstArg.toLowerCase())) {
            // Get all the exampels for that language
            let findExampleForFirstArg = this.client.exampleNames.get(
                firstArg.toLowerCase()
            );
            // Create an embed for the examples in that language
            const embed = new MessageEmbed()
                .setAuthor(`Errors for ${firstArg}`)
                .setColor("#7289DA");

            // Create text for the emebd
            let embedText = `To get the code for a specific example, do \`\`${commandPrefix}examples example-id\`\`\n\n`;

            // For each of the examples we add
            for (const example of findExampleForFirstArg) {
                // Get the example from the examples collection
                let exampleFound = this.client.examples.get(example);

                // If the exampel is not hidden add it to the embed
                if (exampleFound.hidden !== true) {
                    embedText += `**${exampleFound.exampleDisplayName}**\nID: \`\`${exampleFound.exampleId}\`\`\n`;

                    // However if it was hidden continue finding examples
                } else {
                    continue;
                }
            }

            // set the embeds description to the text
            embed.setDescription(embedText);

            // send the embed
            return channel.send(embed);

            // However if we find their example id
        } else if (this.client.exampleIds.get(firstArg.toLowerCase())) {
            // Get the example code from the examples collection
            let exampleCode = this.client.exampleIds.get(
                firstArg.toLowerCase()
            );

            // Get the example
            let example = this.client.examples.get(exampleCode);

            // if the example is hidden return
            if (example.hidden === true) {
                return;
            }

            // Use findExample.js to find the example
            findExample(this.client, example.name, message);

            // However if we didnt find any languages or examples then
        } else {
            // Create an embed
            const errorEmbed = new MessageEmbed()
                .setAuthor(`I do not support that language or example ❌`)
                .setColor("#FF0000")
                .setDescription(
                    `Please try ${commandPrefix}examples to see my supported languages!`
                );

            // send the embed
            return channel.send(errorEmbed);
        }
    };
};
