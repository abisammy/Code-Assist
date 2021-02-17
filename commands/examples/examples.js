const Commando = require("discord.js-commando");
const { MessageEmbed, Util } = require("discord.js");

module.exports = class ErrorsCommand extends Commando.Command {
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
        const { guild, channel } = message;
        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";
        const firstArg = args[0];
        if (!firstArg) {
            const errorsEmbed = new MessageEmbed()
                .setAuthor(`Examples of code for your bot!`)
                .setColor("#7289DA");

            let errorEmbedText = `**To find out the code for a specific example, copy the ID and do \`\`${commandPrefix}examples example-id\`\`\n\n**`;

            for (const example of this.client.examples) {
                let exampleId = example[0];

                errorEmbedText += `\n**${example[0].replace(
                    /-/g,
                    " "
                )}**\nID: \`\`${exampleId}\`\`\n`;
            }

            errorsEmbed.setDescription(errorEmbedText);
            channel.send(errorsEmbed);
        } else {
            let idString = [];

            for (const example of this.client.examples) {
                let exampleid = example[0];

                idString.push(exampleid);
            }
            if (idString.includes(firstArg)) {
                const { author } = message;
                var findIndex = idString.indexOf(firstArg);

                const getExample = require("./../../help/getExample").value;
                let example = getExample(firstArg);
                const [first, ...rest] = Util.splitMessage(example, {
                    maxLength: 2048,
                });
                // return data.replace(/(\r\n|\n|\r)/gm, "\n");
                const exampleEmbed = new MessageEmbed()
                    .setAuthor(`${firstArg.replace(/-/g, " ")} example`)
                    .setColor("#7289DA")
                    .setDescription(first);

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

                if (first.includes("{ SPLIT }")) {
                    let addSplit = first.replace("{ SPLIT }", "```");
                    var textAfterSplit = first.split("{ SPLIT }").pop();

                    let removeChars = addSplit.slice(0, -textAfterSplit.length);
                    exampleEmbed.setDescription(removeChars);
                    await author.send(exampleEmbed).catch((error) => {
                        return;
                    });
                    exampleEmbed.setAuthor(" ");
                    exampleEmbed.setDescription(
                        `\`\`\`js\n${textAfterSplit}\n${rest}`
                    );
                    return author.send(exampleEmbed).catch((error) => {
                        return;
                    });
                } else {
                    await author.send(exampleEmbed).catch((error) => {
                        return;
                    });
                    exampleEmbed.setAuthor(" ");
                    exampleEmbed.setDescription(rest);

                    return author.send(exampleEmbed).catch((error) => {
                        return;
                    });
                }
            } else {
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
