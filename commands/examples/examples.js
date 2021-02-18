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
        // Destructure the guild and channel from the message
        const { guild, channel } = message;

        // Get the command prefix if the message was ran in a server or DM's
        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";

        // Get the first argument
        const firstArg = args[0];

        // If they didnt provide a first argument, send them all the examples
        if (!firstArg) {
            // Create an embed
            const examplesEmbed = new MessageEmbed()
                .setAuthor(`Examples of code for your bot!`)
                .setColor("#7289DA");

            // Add this text to the description
            let exampleEmbedText = `**To find out the code for a specific example, copy the ID and do \`\`${commandPrefix}examples example-id\`\`\n\n**`;

            // For every example in the client.examples map, which we set in loadExamples.js
            for (const example of this.client.examples) {
                // Get the ID for each example
                let exampleId = example[0];

                // Add this to the embed text, which we will add to the description
                exampleEmbedText += `\n**${example[0].replace(
                    /-/g,
                    " "
                )}**\nID: \`\`${exampleId}\`\`\n`;
            }

            // Set the description to the text
            await examplesEmbed.setDescription(exampleEmbedText);

            // Send the embed
            channel.send(examplesEmbed);
        } else {
            // Create an empty string to store all the ID's
            let idString = [];

            // For every example ID in the map
            for (const example of this.client.examples) {
                let exampleid = example[0];
                // Add it to the string
                idString.push(exampleid);
            }

            // If the ID string has our first argument
            if (idString.includes(firstArg)) {
                // Desrcuture the author
                const { author } = message;

                // Get the getExample module.exports from getExample.js
                const getExample = require("@help/getExample").value;

                // Find the example and pass in the first argument
                let example = getExample(firstArg);

                // Split the text if it is over 2048 characters
                const [first, ...rest] = Util.splitMessage(example, {
                    maxLength: 2048,
                });

                // Create the embed
                const exampleEmbed = new MessageEmbed()
                    .setAuthor(`${firstArg.replace(/-/g, " ")} example`)
                    .setColor("#7289DA")
                    .setDescription(first);

                // If the message asnt sent in a DM tell the user to check their DM's
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

                /* This code is made for examples. If the example goes over 2048 characters (discords embed limmit) The code splits it automatically,
                However if we are in the middle of a code block, the code doesnt finish it iwth a ending code block, so it looks unformated
                This code basically splits any code block if you write { SPLIT } in a example, and it will start the rest of the code on a new embed
                */

                // If it has split
                if (first.includes("{ SPLIT }")) {
                    // Replace split with closing code blocks
                    let addSplit = first.replace("{ SPLIT }", "```");

                    // Get all the text after the split
                    var textAfterSplit = first.split("{ SPLIT }").pop();

                    // Remove the rest of the text from the first embed
                    let removeChars = addSplit.slice(0, -textAfterSplit.length);

                    // Set the embeds description to the first text
                    exampleEmbed.setDescription(removeChars);

                    // Send the embed
                    await author.send(exampleEmbed).catch((error) => {
                        return;
                    });

                    // Remove the author for the second embed
                    exampleEmbed.setAuthor(" ");

                    // Set the seconds embed description to the rest of the text from the first one, and the rest of the code
                    exampleEmbed.setDescription(
                        `\`\`\`js\n${textAfterSplit}\n${rest}`
                    );

                    // Send the second embed
                    return author.send(exampleEmbed).catch((error) => {
                        return;
                    });

                    // However if there was no split, so we dont have to split it at a code block
                } else {
                    // Send the first embed
                    await author.send(exampleEmbed).catch((error) => {
                        return;
                    });

                    // Remove the author for the second embed
                    exampleEmbed.setAuthor(" ");

                    // Set the description of the second embed to the rest of the text
                    exampleEmbed.setDescription(rest);

                    // Send the second embed
                    return author.send(exampleEmbed).catch((error) => {
                        return;
                    });
                }

                // However if they did not provide a valid example ID
            } else {
                // Create an embed and tell the user that there is no ID for that example
                const errorEmbed = new MessageEmbed()
                    .setAuthor(
                        `You provided me with an invalid example code ❌`
                    )
                    .setColor("#FF0000");

                return channel.send(errorEmbed);
            }
        }
    };
};
