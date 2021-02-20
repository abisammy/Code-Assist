// Require commando for the command
const { Command } = require("discord.js-commando");

// Require Constants and MessageEMbed from discord.js We use Constants for errors and MessageEmbed for embeds
const { Constants, MessageEmbed } = require("discord.js");

// Create a new map
const commandRunning = new Map();

// Create the command
module.exports = class BugReportCommand extends Command {
    constructor(client) {
        super(client, {
            name: "bugreport",
            aliases: ["bug", "reportbug"],
            group: "misc",
            memberName: "bugreport",
            description: "Report a bug using this command",
        });
    }
    run = (message) => {
        // Destrucutre the authorId and the channeId from the message
        const { author, channel } = message;

        // Define the userId and the userTag for the command
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

        // If the user is already running the command then
        if (commandRunning.get(author.id) === true) {
            // Create an embed
            const errorEmbed = new MessageEmbed()
                .setAuthor(`You are already running this command ❌`)
                .setColor("#FF0000")
                .setDescription(`Please finish your current bug report!`);

            // Return sending the embed
            return channel.send(errorEmbed);
        }

        // Set the command running to the userId to true
        commandRunning.set(author.id, true);

        // Create an embed to ask for the bug report
        const askForBugEmbed = new MessageEmbed()
            .setAuthor(`Please send me the bug report and add any proof`)
            .setColor("#7289DA")
            .setDescription(
                `I will stop looking for messages in 5 minutes! Please send any images as links, as I cannot send a photo as it is!`
            );

        // reply to the message, to check the users Dm's
        message.reply("Check your DM's").then((r) => {
            // Send the user the embed asking for the bug report
            author
                .send(askForBugEmbed)
                .catch((error) => {
                    // If we couldnt ask for the bug report then

                    // If the error code was because we can't Dm the user, then inform the user and return
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        return r.edit("I couldn't DM you!");

                        // However if it was because of a different error, console.log the error and return
                    } else {
                        console.log(error);
                        return;
                    }
                })

                // Once we have sent the embed then
                .then((message) => {
                    // Desturcture the channel from the message
                    const { channel } = message;

                    // Create a filter to make sure the user sending the message is the same emssaeg sending the original message
                    const filter = (message) => {
                        return message.author.id === userId;
                    };

                    // Create a message collector in the channel
                    const bugReportCollector = channel.createMessageCollector(
                        filter,
                        { time: 1000 * 60 * 5 }
                    );

                    // Once we collected a message
                    bugReportCollector.on("collect", (message) => {
                        // Stop collecting messages
                        bugReportCollector.stop();

                        // Get the bug report
                        let bugReport = message.content;

                        // Find the bug report channel
                        const bugReportChannel = this.client.channels.cache.get(
                            "812342349744701471"
                        );

                        // Delete the user from the commandRunning map
                        commandRunning.delete(userId);

                        // Create an embed
                        const bugReportEmbed = new MessageEmbed()
                            .setAuthor(`New bug report`)
                            .setColor("#7289DA")
                            .setDescription(
                                `**Filled by:** ${userTag} (${userId})\n\n**Report:**\n${bugReport}`
                            );

                        // Send the embed in the bug report channel
                        bugReportChannel.send(bugReportEmbed).catch((error) => {
                            // If we couldnt send the bug report, console.log the error

                            console.log("failed to file bug report");
                            console.log(error);
                        });

                        // Create a final embed to send the suer
                        const finalEmbed = new MessageEmbed()
                            .setAuthor(`Bug report filed`)
                            .setColor("#7289DA")
                            .setDescription(
                                `**Warning** Abusing this system could get you blacklisted from this bot!`
                            );

                        // send the last embed to the user
                        return channel.send(finalEmbed).catch((error) => {
                            // If we couldnt DM the user the last embed then

                            // If the error code was because we can't Dm the user then return
                            if (
                                error.code ===
                                Constants.APIErrors.CANNOT_MESSAGE_USER
                            ) {
                                return;
                                // However if it was a different error, console.log the error and return
                            } else {
                                console.log(error);
                                return;
                            }
                        });
                    });

                    // Once we stopped collecting messages
                    bugReportCollector.on("end", (collected) => {
                        // If the user didn't send a bug report, create an embed
                        if (collected.size < 1) {
                            const errorEmbed = new MessageEmbed()
                                .setAuthor(`Bug report took too long ❌`)
                                .setColor("#FF0000")
                                .setDescription(
                                    `Please try report a bug later!`
                                );

                            // Remove the user from the commandRunning map
                            commandRunning.delete(userId);

                            // Return sending the user the embed
                            return channel.send(errorEmbed).catch((error) => {
                                // If we couldnt DM the user then

                                // if the error code was because we cant DM the user then return
                                if (
                                    error.code ===
                                    Constants.APIErrors.CANNOT_MESSAGE_USER
                                ) {
                                    return;

                                    // However if it was a different error message console.log the error and return
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
