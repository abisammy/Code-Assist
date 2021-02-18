const fs = require("fs");
const { MessageEmbed, Util } = require("discord.js");
module.exports = async (client, error, message) => {
    const { author, channel } = message;
    let findError = client.errors.get(error);

    var data = fs.readFileSync(findError.errorFixPath, "utf-8");
    let convertToEmbedDescription = data.replace(/(\r\n|\n|\r)/gm, "\n");

    const [first, ...rest] = Util.splitMessage(convertToEmbedDescription, {
        maxLength: 2048,
    });

    const errorEmbed = new MessageEmbed()
        .setAuthor(`This error is a ${findError.language} error!`)
        .setTitle(findError.embedHeading)
        .setColor("#7289DA")
        .setDescription(first);
    if (channel.type !== "dm" && !rest.length) {
        await message.reply("Check your DM's!").then(async (r) => {
            await author.send(errorEmbed).catch((error) => {
                r.edit("I couldn't DM you!");
                return;
            });
        });
        return;
    } else if (!rest.length) {
        await author.send(errorEmbed).catch((error) => {
            return;
        });
        return;
    } else {
        if (first.includes("{ SPLIT }")) {
            let addSplit = first.replace("{ SPLIT }", "```");

            var textAfterSplit = first.split("{ SPLIT }").pop();

            let removeChars = addSplit.slice(0, -textAfterSplit.length);

            await errorEmbed.setDescription(removeChars);

            if (channel.type !== "dm") {
                await message.reply("Check your DM's!").then(async (r) => {
                    await author.send(errorEmbed).catch((error) => {
                        r.edit("I couldn't DM you!");
                        return;
                    });
                });
            } else {
                await author.send(errorEmbed).catch((error) => {
                    return;
                });
            }

            await errorEmbed.setTitle(" ");
            await errorEmbed.setAuthor(" ");

            await errorEmbed.setDescription(
                `\`\`\`js\n${textAfterSplit}\n${rest}`
            );

            await author.send(errorEmbed).catch((error) => {
                return;
            });
            return;
        } else {
            if (channel.type !== "dm") {
                await message.reply("Check your DM's!").then(async (r) => {
                    await author.send(errorEmbed).catch((error) => {
                        r.edit("I couldn't DM you!");
                        return;
                    });
                });
            } else {
                await author.send(errorEmbed).catch((error) => {
                    return;
                });
            }

            errorEmbed.setTitle(" ");
            errorEmbed.setAuthor(" ");

            errorEmbed.setDescription(rest);

            author.send(errorEmbed).catch((error) => {
                return;
            });
            return;
        }
    }
};
