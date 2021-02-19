const Commando = require("discord.js-commando");
const commandRunning = new Map();
const { Constants, MessageEmbed } = require("discord.js");

function loadCommandRunning(userId) {
    if (!commandRunning.get(userId)) {
        commandRunning.set(userId, false);
        return;
    } else {
        return;
    }
}
module.exports = class BugReportCommand extends Commando.Command {
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
        const { author, channel } = message;
        loadCommandRunning(author.id);
        let userId = author.id;
        let userTag = author.tag;

        if (commandRunning.get(author.id) === true) {
            const errorEmbed = new MessageEmbed()
                .setAuthor(`You are already running this command!`)
                .setColor("#7289DA")
                .setDescription(`Please finish your current bug report!`);

            return channel.send(errorEmbed);
        }

        commandRunning.set(author.id, true);

        const askForBugEmbed = new MessageEmbed()
            .setAuthor(`Please send me the bug report and add any proof`)
            .setColor("#7289DA")
            .setDescription(
                `I will stop looking for messages in 5 minutes! Please send any images as links, as I cannot send a photo as it is!`
            );

        message.reply("Check your DM's").then((r) => {
            author
                .send(askForBugEmbed)
                .catch((error) => {
                    if (
                        error.code === Constants.APIErrors.CANNOT_MESSAGE_USER
                    ) {
                        return r.edit("I couldn't DM you!");
                    } else {
                        console.log(error);
                        return;
                    }
                })
                .then((message) => {
                    const { channel } = message;
                    const filter = (message) => {
                        return message.author.id === userId;
                    };
                    const bugReportCollector = channel.createMessageCollector(
                        filter,
                        { time: 1000 * 60 * 5 }
                    );

                    bugReportCollector.on("collect", (message) => {
                        bugReportCollector.stop();
                        let bugReport = message.content;
                        const bugReportChannel = this.client.channels.cache.get(
                            "812342349744701471"
                        );
                        commandRunning.delete(userId);
                        const bugReportEmbed = new MessageEmbed()
                            .setAuthor(`New bug report`)
                            .setColor("#7289DA")
                            .setDescription(
                                `**Filled by:** ${userTag} (${userId})\n\n**Report:**\n${bugReport}`
                            );

                        bugReportChannel.send(bugReportEmbed).catch((error) => {
                            console.log("failed to file bug report");
                            console.log(error);
                        });
                        const finalEmbed = new MessageEmbed()
                            .setAuthor(`Bug report filed`)
                            .setColor("#7289DA")
                            .setDescription(
                                `**Warning** Abusing this system could get you blacklisted from this bot!`
                            );

                        return channel.send(finalEmbed).catch((error) => {
                            if (
                                error.code ===
                                Constants.APIErrors.CANNOT_MESSAGE_USER
                            ) {
                                return;
                            } else {
                                console.log(error);
                                return;
                            }
                        });
                    });

                    bugReportCollector.on("end", (collected) => {
                        if (collected.size < 1) {
                            const errorEmbed = new MessageEmbed()
                                .setAuthor(`Bug report took too long ❌`)
                                .setColor("#FF0000")
                                .setDescription(
                                    `Please try report a bug later!`
                                );
                            commandRunning.delete(userId);
                            return channel.send(errorEmbed).catch((error) => {
                                if (
                                    error.code ===
                                    Constants.APIErrors.CANNOT_MESSAGE_USER
                                ) {
                                    return;
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
