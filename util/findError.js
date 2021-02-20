// Require fs to fin the folders
const fs = require("fs");

// require embeds, util (to split the error exmplanations) and constants (to get the error messages) from discord.js
const { MessageEmbed, Util, Constants } = require("discord.js");

// Export the function, requiring the client, the error and the message
module.exports = async (client, error, message) => {
    // Destructure the author and the channel from the message
    const { author, channel } = message;

    // Find the error in client.errors, this is a map we set in loadErrors.js
    let findError = client.errors.get(error);

    // data is using fs to find the path (which we set in loadErrors) and read it
    var data = fs.readFileSync(findError.errorFixPath, "utf-8");

    // Convert each new line on the embed to \n as this converts it to an embed description
    let convertToEmbedDescription = data.replace(/(\r\n|\n|\r)/gm, "\n");

    // Split the message in two if it is over 2048 characters (discords embed description limmit)
    const [first, ...rest] = Util.splitMessage(convertToEmbedDescription, {
        maxLength: 2048,
    });

    // Create the embed
    const errorEmbed = new MessageEmbed()

        .setTitle(findError.embedHeading)
        .setColor("#7289DA")
        .setDescription(first);

    // If we want to show the language on the embed (like this is a javascript error) we can here
    if (findError.showLanguage !== false) {
        await errorEmbed.setAuthor(
            `This error is a ${findError.language} error!`
        );
    }

    // If the message was not sent in a DM and there is only one embed to send then
    if (channel.type !== "dm" && !rest.length) {
        // Reply to check the users DM's
        await message.reply("Check your DM's!").then(async (r) => {
            // Send the embed
            await author.send(errorEmbed).catch((error) => {
                // If we couldnt send the embed then

                // If the error code is that we can't DM the user then edit the reply
                if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                    r.edit("I couldn't DM you!");
                    return;

                    // However if it was something else, console.log the error
                } else {
                    console.log(error);
                }
            });
        });

        // And return from sending the message
        return;

        // Else if it was sent in a DM but there is only one embed to send then
    } else if (!rest.length) {
        // Send the embed
        await author.send(errorEmbed).catch((error) => {
            // If we couldnt send the embed then

            // If the error code was because we couldn't dm the user then return
            if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                return;
            } else {
                // However if it was something else console.log the error
                console.log(error);
                return;
            }
        });

        // And return from sending the message
        return;

        // If there is two embeds to send then
    } else {
        // If the first embed includes { SPLIT } which basically means a code block goes into the second embed
        if (first.includes("{ SPLIT }")) {
            // Replace split with ``` to close the code block
            let addSplit = first.replace("{ SPLIT }", "```");

            // Get the text after the { SPLIT }
            var textAfterSplit = first.split("{ SPLIT }").pop();

            // Remove the text from split
            let removeChars = addSplit.slice(0, -textAfterSplit.length);

            // Change the embed description to the closing code blocks
            await errorEmbed.setDescription(removeChars);

            // If the channel is not a DM then
            if (channel.type !== "dm") {
                // Reply to the user
                await message.reply("Check your DM's!").then(async (r) => {
                    // Send the embed
                    await author.send(errorEmbed).catch((error) => {
                        // If there was an error sending the embed

                        // If the error code was because we can't DM the user then inform the user
                        if (
                            error.code ===
                            Constants.APIErrors.CANNOT_MESSAGE_USER
                        ) {
                            r.edit("I couldn't DM you!");
                            return;

                            // However if it was something different then console.log the error and return
                        } else {
                            console.log(error);
                            return;
                        }
                    });
                });

                // Return
                return;

                // However if it was a DM that the original message was sent in
            } else {
                // Send the embed
                await author.send(errorEmbed).catch((error) => {
                    // If we couldnt send the embed then

                    // If the error was because we couldnt Dm the user then return
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        return;

                        // However if it was a diferent error than console.log the error
                    } else {
                        console.log(error);
                        return;
                    }
                });
            }

            // Change the embeds title to nothing
            await errorEmbed.setTitle(" ");

            // Change the embeds author to nothing
            await errorEmbed.setAuthor(" ");

            // Change the embeds description to opening code blocks, the text we cut off from the original embed and the rest of the error
            await errorEmbed.setDescription(
                `\`\`\`js\n${textAfterSplit}\n${rest}`
            );

            // Send the embed
            await author.send(errorEmbed).catch((error) => {
                // If we couldnt send the embed then

                // If the error was because we couldnt Dm the user then return
                if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                    return;

                    // However if it was a diferent error than console.log the error
                } else {
                    console.log(error);
                    return;
                }
            });

            // Return
            return;

            // However if the error did not include { SPLIT } then
        } else {
            // If the channel was not a DM then
            if (channel.type !== "dm") {
                // Reply to the message to check their dm's
                await message.reply("Check your DM's!").then(async (r) => {
                    // Send the embed
                    await author.send(errorEmbed).catch((error) => {
                        // If we couldnt dm the user then

                        // If the error code was becuase we couldnt dm the user then inform the user
                        if (
                            error.code ===
                            Constants.APIErrors.CANNOT_MESSAGE_USER
                        ) {
                            r.edit("I couldn't DM you!");
                            return;

                            // However if the error was because of something else then return
                        } else {
                            console.log(error);
                            return;
                        }
                    });
                });

                // Remove the embed author and title for the next embed

                await errorEmbed.setTitle(" ");
                await errorEmbed.setAuthor(" ");

                // set the embed description to the rest of the error
                await errorEmbed.setDescription(rest);

                // Send the second embed to the user
                await author.send(errorEmbed).catch((error) => {
                    // If we couldnt dm the user then

                    // If the error code was because we couldnt dm the user then return
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        return;

                        // However if the error was because of something else the nconsole.log the errir and return
                    } else {
                        console.log(error);
                        return;
                    }
                });

                // And return
                return;

                // However if it was in DM's then
            } else {
                // Send the first embed
                await author.send(errorEmbed).catch((error) => {
                    // If we couldnt send the first embed then

                    // If the error was because we couldnt DM the user then just return
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        return;

                        // However if the error was becasue of something else then console.log the error and return
                    } else {
                        console.log(error);
                        return;
                    }
                });
            }

            // Remove the embed author and title for the next embed

            await errorEmbed.setTitle(" ");
            await errorEmbed.setAuthor(" ");

            // set the embed description to the rest of the error
            await errorEmbed.setDescription(rest);

            // Send the second embed to the user
            await author.send(errorEmbed).catch((error) => {
                // If we couldnt DM the user then

                // If the error code was because we couldnt DM the user then return
                if (error.code === Constants.APIErrors.CANNOT_MESSAGE_USER) {
                    return;

                    // However if the error was something else then console.log the error and return
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
