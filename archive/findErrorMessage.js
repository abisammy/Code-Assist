const { MessageEmbed, Util } = require("discord.js");

module.exports = (client) => {
    client.on("message", async (message) => {
        const { guild, channel, author } = message;
        let { content: messageContent } = message;
        if (channel.type !== "dm") {
            let prefix = guild.commandPrefix;

            if (messageContent.startsWith(prefix)) return;
        }

        let args = messageContent.split(/ +/);
        let contentJoinedToLowerCase = args.join("").toLowerCase();

        for (const key of client.errors) {
            let errors = key[1].errors;

            for (const error of errors) {
                if (contentJoinedToLowerCase.includes(error)) {
                    if (key[1].embedOrNot === true) {
                        const getExample = require("./../../help/getFix").value;
                        let example = getExample(key[0]);

                        const [first, ...rest] = Util.splitMessage(example, {
                            maxLength: 2048,
                        });

                        const exampleEmbed = new MessageEmbed()
                            .setAuthor(key[1].description)
                            .setColor("#7289DA")
                            .setDescription(first);

                        if (channel.type !== "dm") {
                            message.reply("Check your DMs!");
                        }

                        if (!rest.length) {
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
                        return key[1].execute(channel, MessageEmbed, message);
                    }
                }
            }
        }
    });
};
