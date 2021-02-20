// require commando for the command
const { Command } = require("discord.js-commando");

// require constants and embeds from discord.js. Constants are for the error codes and MessageEmbed is for embeds
const { Constants, MessageEmbed } = require("discord.js");

// Create a new map called commandRunning. This is to check if the user is already suggesting something
const commandRunning = new Map();

// Create the commando command
module.exports = class SuggestCommand extends Command {
    constructor(client) {
        super(client, {
            name: "suggest",
            aliases: ["suggestion"],
            group: "misc",
            memberName: "suggest",
            description: "Suggest a feature using this command",
        });
    }
    run = (message) => {
        // Destructure the author and the channel from the message
        const { author, channel } = message;

        // defien the userId and userTag for later use
        let userId = author.id;
        let userTag = author.tag;

        // Make sure we have the embed links permission in the channel
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }

        // If the user is already running the command
        if (commandRunning.get(author.id) === true) {
            // Create an embed
            const errorEmbed = new MessageEmbed()
                .setAuthor(`You are already running this command ❌`)
                .setColor("#FF0000")
                .setDescription(`Please finish your current suggestion!`);

            // And send it
            return channel.send(errorEmbed);
        }

        // Set the user to running the command as true
        commandRunning.set(userId, true);

        // Create an embed to ask for a suggestion
        const askForSuggestionEmbed = new MessageEmbed()
            .setAuthor(`Please send me the suggestion`)
            .setColor("#7289DA")
            .setDescription(
                `I will stop looking for messages in 5 minutes! Please send any images as links, as I cannot send a photo as it is!`
            );

        // Reply to the message to check the users DM
        message.reply("Check your DM's").then((r) => {
            // Send the user the embed
            author
                .send(askForSuggestionEmbed)
                .catch((error) => {
                    // If we couldnt send the user the embed then

                    // If the error was because we can't DM the user unform the user and return
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        commandRunning.delete(userId);
                        return r.edit("I couldn't DM you!");

                        // However if it was a different error, console.log the error and return
                    } else {
                        commandRunning.delete(userId);
                        console.log(error);
                        return;
                    }
                })
                .then((message) => {
                    // If we succesfully DM the user then

                    // Destructure the channel from the message
                    const { channel } = message;

                    // Create a filter, to check if the user ID is the same as the user ID of the original sender
                    const filter = (message) => {
                        return message.author.id === userId;
                    };

                    // Create a message collector for the channel
                    const suggestionCommandCollector = channel.createMessageCollector(
                        filter,
                        { time: 1000 * 60 * 5 }
                    );

                    // When we collect a message
                    suggestionCommandCollector.on("collect", (message) => {
                        // Stop the collector
                        suggestionCommandCollector.stop();

                        // Define the content as a suggestion
                        let suggestion = message.content;

                        // Get the suggestion channel
                        const suggestionChannel = this.client.channels.cache.get(
                            "812343937054146600"
                        );

                        // Delete the userId from the command running map
                        commandRunning.delete(userId);

                        // Create an embed with the suggestion
                        const suggestionEmbed = new MessageEmbed()
                            .setAuthor(`New bug report`)
                            .setColor("#7289DA")
                            .setDescription(
                                `**Filled by:** ${userTag} (${userId})\n\n**Suggestion:**\n${suggestion}`
                            );

                        // Send the suggestion
                        suggestionChannel
                            .send(suggestionEmbed)
                            .catch((error) => {
                                // If there was an error sending a suggestion console.log the error
                                console.log("Failed to file suggestion!");
                                console.log(error);
                            });

                        // Create an embed to send the user
                        const finalEmbed = new MessageEmbed()
                            .setAuthor(`Bug report filed`)
                            .setColor("#7289DA")
                            .setDescription(
                                `**Warning** Abusing this system could get you blacklisted from this bot!`
                            );

                        // Send the user the final embed
                        return channel.send(finalEmbed).catch((error) => {
                            // If there was an error sending the final embed then

                            // If the error was beacue we can't DM the user then return
                            if (
                                error.code ===
                                Constants.APIErrors.CANNOT_MESSAGE_USER
                            ) {
                                return;

                                // However if it was a different error, console.log the error
                            } else {
                                console.log(error);
                                return;
                            }
                        });
                    });

                    // Once we finished collecting messages
                    suggestionCommandCollector.on("end", (collected) => {
                        // If they didnt suggest something
                        if (collected.size < 1) {
                            // Create an embed to send to the user
                            const errorEmbed = new MessageEmbed()
                                .setAuthor(`Suggestion took too long ❌`)
                                .setColor("#FF0000")
                                .setDescription(
                                    `Please try suggest something later!`
                                );

                            // Remove the userID from the commandRunning map
                            commandRunning.delete(userId);

                            // Send the user the embed
                            return channel.send(errorEmbed).catch((error) => {
                                // If we couldnt dm the user the embed then

                                // If the error was becasue we can't dm the user then just return
                                if (
                                    error.code ===
                                    Constants.APIErrors.CANNOT_MESSAGE_USER
                                ) {
                                    return;

                                    // However if it was because of a different error, console.log the error and return
                                } else {
                                    console.log(error);
                                    return;
                                }
                            });
                        }
                    });
                });
        });
    };
};
