const fs = require("fs");
const { MessageEmbed, Util } = require("discord.js");
module.exports = async (client, example, message) => {
    const { author, channel } = message;
    let findExample = client.examples.get(example);

    var data = fs.readFileSync(findExample.exampleExamplePath, "utf-8");
    let convertToEmbedDescription = data.replace(/(\r\n|\n|\r)/gm, "\n");

    const [first, ...rest] = Util.splitMessage(convertToEmbedDescription, {
        maxLength: 2048,
    });

    const exampleEmbed = new MessageEmbed()
        .setAuthor(
            `This example is a ${
                findExample.language
            } example, it has a ${findExample.difficulty.toLowerCase()} difficulty!`
        )
        .setTitle(findExample.embedHeading)
        .setColor("#7289DA")
        .setDescription(first);
    if (channel.type !== "dm" && !rest.length) {
        await message.reply("Check your DM's!").then(async (r) => {
            await author.send(exampleEmbed).catch((error) => {
                r.edit("I couldn't DM you!");
                return;
            });
        });
        return;
    } else if (!rest.length) {
        await author.send(exampleEmbed).catch((error) => {
            return;
        });
        return;
    } else {
        if (first.includes("{ SPLIT }")) {
            let addSplit = first.replace("{ SPLIT }", "```");

            var textAfterSplit = first.split("{ SPLIT }").pop();

            let removeChars = addSplit.slice(0, -textAfterSplit.length);

            await exampleEmbed.setDescription(removeChars);

            if (channel.type !== "dm") {
                await message.reply("Check your DM's!").then(async (r) => {
                    await author.send(exampleEmbed).catch((error) => {
                        r.edit("I couldn't DM you!");
                        return;
                    });
                });
            } else {
                await author.send(exampleEmbed).catch((error) => {
                    return;
                });
            }

            await exampleEmbed.setTitle(" ");
            await exampleEmbed.setAuthor(" ");

            await exampleEmbed.setDescription(
                `\`\`\`js\n${textAfterSplit}\n${rest}`
            );

            await author.send(exampleEmbed).catch((error) => {
                return;
            });
            return;
        } else {
            if (channel.type !== "dm") {
                await message.reply("Check your DM's!").then(async (r) => {
                    await author.send(exampleEmbed).catch((error) => {
                        r.edit("I couldn't DM you!");
                        return;
                    });
                });
            } else {
                await author.send(exampleEmbed).catch((error) => {
                    return;
                });
            }

            exampleEmbed.setTitle(" ");
            exampleEmbed.setAuthor(" ");

            exampleEmbed.setDescription(rest);

            author.send(exampleEmbed).catch((error) => {
                return;
            });
            return;
        }
    }
};
