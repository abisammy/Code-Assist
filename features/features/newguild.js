module.exports = (client) => {
    const { MessageEmbed } = require(`discord.js`);

    client.on("guildCreate", (guild) => {
        const newGuildEmbed = new MessageEmbed()
            .setColor("#7289DA")
            .setTitle(`Hello!`)
            .setDescription(
                `My name is Code Assist! My default prefix is \`${guild.commandPrefix}\` but don't worry, you can change it with \`\`${guild.commandPrefix}prefix new-prefix\`\`. Here are some of my commands to help you get started!`
            )
            .addField(
                `\`\`${guild.commandPrefix} help\`\``,
                `Shows all commands available for you to use!`
            );
        const channel = guild.channels.cache.find(
            (channel) =>
                channel.type === "text" &&
                channel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
                channel.permissionsFor(guild.me).has("VIEW_CHANNEL") &&
                channel.permissionsFor(guild.me).has("EMBED_LINKS")
        );
        channel.send(newGuildEmbed);
    });
};
