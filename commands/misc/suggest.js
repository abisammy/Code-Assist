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
module.exports = class SuggestCommand extends Commando.Command {
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

        const askForSuggestionEmbed = new MessageEmbed()
            .setAuthor(`Please send me the suggestion`)
            .setColor("#7289DA")
            .setDescription(
                `I will stop looking for messages in 5 minutes! Please send any images as links, as I cannot send a photo as it is!`
            );

        message.reply("Check your DM's").then((r) => {
            author
                .send(askForSuggestionEmbed)
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
                    const suggestionCommandCollector = channel.createMessageCollector(
                        filter,
                        { time: 1000 * 60 * 5 }
                    );

                    suggestionCommandCollector.on("collect", (message) => {
                        suggestionCommandCollector.stop();
                        let suggestion = message.content;
                        const suggestionChannel = this.client.channels.cache.get(
                            "812343937054146600"
                        );
                        commandRunning.delete(userId);
                        const suggestionEmbed = new MessageEmbed()
                            .setAuthor(`New bug report`)
                            .setColor("#7289DA")
                            .setDescription(
                                `**Filled by:** ${userTag} (${userId})\n\n**Report:**\n${suggestion}`
                            );

                        suggestionChannel
                            .send(suggestionEmbed)
                            .catch((error) => {
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

                    suggestionCommandCollector.on("end", (collected) => {
                        if (collected.size < 1) {
                            const errorEmbed = new MessageEmbed()
                                .setAuthor(`Suggestion took too long ❌`)
                                .setColor("#FF0000")
                                .setDescription(
                                    `Please try suggest something later!`
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
