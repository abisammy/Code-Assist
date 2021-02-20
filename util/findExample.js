// Require fs to fin the folders
const fs = require("fs");

// require embeds, util (to split the examples) and constants (to get the error messages) from discord.js
const { MessageEmbed, Util, Constants } = require("discord.js");

// Export the function, requiring the client, the example and the message
module.exports = async (client, example, message) => {
    // Destrucutre the channel and the author from the message
    const { author, channel } = message;

    // Find the example in the examples map whicbh we set in loadExamples.js
    let findExample = client.examples.get(example);

    // Find the txt filw with the example with the file path which we set in loadExamples.js
    var data = fs.readFileSync(findExample.exampleExamplePath, "utf-8");

    // Convert each new line on the embed to \n as this converts it to an embed description
    let convertToEmbedDescription = data.replace(/(\r\n|\n|\r)/gm, "\n");

    // Split the message in two if it is over 2048 characters (discords embed description limmit)
    const [first, ...rest] = Util.splitMessage(convertToEmbedDescription, {
        maxLength: 2048,
    });

    // Create the embed
    const exampleEmbed = new MessageEmbed()
        .setAuthor(
            `This example is a ${
                findExample.language
            } example, it has a ${findExample.difficulty.toLowerCase()} difficulty!`
        )
        .setTitle(findExample.embedHeading)
        .setColor("#7289DA")
        .setDescription(first);

    // If the channel the original message sent in was not a dm and we only need to send one embed then
    if (channel.type !== "dm" && !rest.length) {
        // Reply to check the users DM's
        await message.reply("Check your DM's!").then(async (r) => {
            // Send the user the embed
            await author.send(exampleEmbed).catch((error) => {
                // If we couldnt DM the user then

                // If the error code was becasue we couldnt DM the user then inform the user
                if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                    r.edit("I couldn't DM you!");
                    return;

                    // However if the error was something else console.log the error and return
                } else {
                    console.log(error);
                    return;
                }
            });
        });

        // And finally return
        return;

        // However if we only need to send one embed, but the original message was sent in DM's then
    } else if (!rest.length) {
        // Send the user the embed
        await author.send(exampleEmbed).catch((error) => {
            // If we couldnt DM the user then

            // If the error was because we can't DM the user then return
            if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                return;

                // However if it was a different error console.log the error and return
            } else {
                console.log(error);
                return;
            }
        });

        // And finally return
        return;

        // However if we need to send two embeds then
    } else {
        // If the first embed includes { SPLIT } which basically means a code block goes into the second embed
        if (first.includes("{ SPLIT }")) {
            // Replace the { SPLIT } with ```
            let addSplit = first.replace("{ SPLIT }", "```");

            // Get the text after the word { SPLIT }
            var textAfterSplit = first.split("{ SPLIT }").pop();

            // Remove the remaining characters from after { SPLIT }
            let removeChars = addSplit.slice(0, -textAfterSplit.length);

            // Change the embeds description to the removed characters
            await exampleEmbed.setDescription(removeChars);

            // If the original message was not in a DM then
            if (channel.type !== "dm") {
                // Tell the user to check their DM's
                await message.reply("Check your DM's!").then(async (r) => {
                    // send the suer the embed
                    await author.send(exampleEmbed).catch((error) => {
                        // If there was an error in sending the embed

                        // If the error was becasue we cant DM the user, inform the user and return
                        if (
                            error.code ===
                            Constants.APIErrors.CANNOT_MESSAGE_USER
                        ) {
                            r.edit("I couldn't DM you!");
                            return;

                            // However if it was a different error console.log the error and return
                        } else {
                            console.log(error);
                            return;
                        }
                    });
                });

                // If the original message was sent in DM's
            } else {
                // Send the embed
                await author.send(exampleEmbed).catch((error) => {
                    // If we couldnt DM the user then

                    // If the error was because we can't DM the user then return
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        return;

                        // However if it was a different error then console.log the error and return
                    } else {
                        console.log(error);
                    }
                });
            }

            // Remove the title for the second embed
            await exampleEmbed.setTitle(" ");

            // Remove the author for the second embed
            await exampleEmbed.setAuthor(" ");

            // Change the second embeds description to opening code blocks and the rest of the example
            await exampleEmbed.setDescription(
                `\`\`\`js\n${textAfterSplit}\n${rest}`
            );

            // Send the second embed
            await author.send(exampleEmbed).catch((error) => {
                // If we couldnt DM the user then

                // If the error was because we can't DM the user then return
                if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                    return;

                    // However if it was a different error then console.log the error and return
                } else {
                    console.log(error);
                }
            });

            // And finally return
            return;

            // However if the example does not include { SPLIT }
        } else {
            // If the original message was not sent in a DM then
            if (channel.type !== "dm") {
                // Reply to check the users DM's
                await message.reply("Check your DM's!").then(async (r) => {
                    // Send the user the embed
                    await author.send(exampleEmbed).catch((error) => {
                        // If we couldnt send the user to check their DM's

                        // If the error code was because we cant message the user inform the user and return
                        if (
                            error.code ===
                            Constants.APIErrors.CANNOT_MESSAGE_USER
                        ) {
                            r.edit("I couldn't DM you!");
                            return;

                            // However if it was a different error console.log the error and return
                        } else {
                            console.log(error);
                            return;
                        }
                    });
                });

                // However if the original message was sent in DM's then
            } else {
                // Send the user the DM
                await author.send(exampleEmbed).catch((error) => {
                    // If we couldnt DM the user then

                    // If the error code was becasue we cant DM the user then return
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        return;

                        // However if it was a different error console.log the error and return
                    } else {
                        console.log(error);
                        return;
                    }
                });
            }

            // Remove the title and author for the second embed
            await exampleEmbed.setTitle(" ");
            await exampleEmbed.setAuthor(" ");

            // Change the second embeds description to the rest of the text
            await exampleEmbed.setDescription(rest);

            // send the user the second embed
            await author.send(exampleEmbed).catch((error) => {
                // If we couldnt DM the user then

                // If the error was because we cant dm the user then return
                if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                    return;

                    // However if it was a different error then console.log the error and return
                } else {
                    console.log(error);
                    return;
                }
            });

            // And finally return
            return;
        }
    }
};
