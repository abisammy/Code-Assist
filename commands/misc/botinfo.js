// require commando for the command
const { Command } = require("discord.js-commando");

// Require the bots version
const { version } = require("@root/package.json");

// require messageEmbed from discord.js
const { MessageEmbed } = require("discord.js");

// Create the command
module.exports = class BotInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "botinfo",
            group: "misc",
            memberName: "botinfo",
            aliases: ["botstats"],
            description: "Shows information about the bot!",
        });
    }
    run = async (message) => {
        // destrucutre the channel and the guild from the message
        const { channel, guild } = message;

        return channel.send(
            "This command has been temporarily disabled due to an API error"
        );

        // Make sure wehave permissions to run the command
        if (
            channel.type === "text" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );

            return;
        }

        // get the total messages the bot is in
        let totalMembers = 0;

        for (const guild of this.client.guilds.cache) {
            totalMembers += (await guild[1].members.fetch()).size;
        }

        // Get the uptime the bot has been on for
        let time = process.uptime();

        // this is a function, probably not coded well to convert milliseconds into seconds, mintues and hours
        function format(time) {
            // Hours, minutes and seconds
            var hrs = ~~(time / 3600);
            var mins = ~~((time % 3600) / 60);
            var secs = ~~time % 60;

            // Output like "1:01" or "4:03:59" or "123:03:59"
            var ret = "";
            if (hrs > 0) {
                if (hrs === 1) {
                    ret += "" + hrs + " hour, " + (mins < 10 ? "0" : "");
                    if (mins === 1) {
                        ret +=
                            "" +
                            mins +
                            " minute and  " +
                            (secs < 10 ? "0" : "");
                        if (secs === 1) {
                            ret += "" + secs + " second";
                            return ret;
                        }
                        ret += "" + secs + " seconds";
                        return ret;
                    }
                    ret +=
                        "" + mins + " minutes and  " + (secs < 10 ? "0" : "");
                    if (secs === 1) {
                        ret += "" + secs + " second";
                        return ret;
                    }
                    ret += "" + secs + " seconds";
                    return ret;
                }
                ret += "" + hrs + " hours, " + (mins < 10 ? "0" : "");
            }
            if (mins === 1) {
                ret += "" + mins + " minute and  " + (secs < 10 ? "0" : "");
                if (secs === 1) {
                    ret += "" + secs + " second";
                    return ret;
                }
                ret += "" + secs + " seconds";
                return ret;
            }
            ret += "" + mins + " minutes and  " + (secs < 10 ? "0" : "");
            if (secs === 1) {
                ret += "" + secs + " second";
                return ret;
            }
            ret += "" + secs + " seconds";
            return ret;
        }

        // Get the command prefix
        let commandPrefix = guild
            ? guild.commandPrefix
            : "This is not a server!";

        // Create an embed
        const embed = new MessageEmbed()
            .setAuthor(
                `Information about the ${this.client.user.username} Bot`,
                this.client.user.displayAvatarURL()
            )
            .setColor("#7289DA")
            .addFields(
                {
                    name: "Bot tag",
                    value: this.client.user.tag,
                },
                {
                    name: "Version",
                    value: version,
                },
                {
                    name: "Server's command prefix",
                    value: commandPrefix,
                },
                {
                    name: "Time since last restart",
                    value: `${format(time)}!`,
                },
                {
                    name: "Server count",
                    value: this.client.guilds.cache.size,
                },
                {
                    name: "Total members",
                    value: totalMembers,
                }
            );

        // send the embed
        channel.send(embed);
    };
};
