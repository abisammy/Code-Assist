// Export the function requireing the client
module.exports = (client) => {
    // Require MessageEmbed from discord.js
    const { MessageEmbed } = require(`discord.js`);

    // When the bot is added to a new guild
    client.on("guildCreate", (guild) => {
        // Create a embed
        const newGuildEmbed = new MessageEmbed()
            .setColor("#7289DA")
            .setTitle(`Hello!`)
            .setDescription(
                `My name is Code Assist! My default prefix is \`${guild.commandPrefix}\` but don't worry, you can change it with \`\`${guild.commandPrefix}prefix new-prefix\`\`. My job is to help discord servers who are made to help people with coding. I can asses common errors and provide some examples! If you want to learn how to help this bot grow, just do \`\`${guild.commandPrefix}contribute\`\`. Here are some of my commands to help you get started!`
            )
            .addField(
                `\`\`${guild.commandPrefix} help\`\``,
                `Shows all commands available for you to use!`
            );

        // Find all the channels and make sure the bot has the correct permissions
        const channel = guild.channels.cache.find(
            (channel) =>
                channel.type === "text" &&
                channel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
                channel.permissionsFor(guild.me).has("VIEW_CHANNEL") &&
                channel.permissionsFor(guild.me).has("EMBED_LINKS")
        );

        // Send the embed
        channel.send(newGuildEmbed);
    });
};
