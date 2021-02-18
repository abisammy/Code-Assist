const Commando = require("discord.js-commando");
const { version } = require("@root/package.json");
const { MessageEmbed } = require("discord.js");

module.exports = class BotInfoCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "botinfo",
            group: "misc",
            memberName: "botinfo",
            aliases: ["botstats"],
            description: "Shows information about the bot!",
        });
    }
    run = async (message, args) => {
        const { channel, guild } = message;

        if (
            channel.type === "text" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );

            return;
        }

        let totalMembers = 0;

        for (const guild of this.client.guilds.cache) {
            totalMembers += (await guild[1].members.fetch()).size;
        }

        let time = process.uptime();
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

        let commandPrefix = guild
            ? guild.commandPrefix
            : "This is not a server!";

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
        message.channel.send(embed);
    };
};
