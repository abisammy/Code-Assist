module.exports = (client) => {
    const Discord = require(`discord.js`);
    const colors = require("@util/jsons/colors.json");

    function consoleLogColor(color, text) {
        console.log(`\x1b[${colors[color]}m%s\x1b[0m`, text);
    }
    process.on("unhandledRejection", (error) => {
        const errorEmbed = new Discord.MessageEmbed()
            .setAuthor(`There has been an error while running a command`)
            .setColor("#FF0000")
            .setDescription(`Error message: \`\`\`${error}\`\`\``);

        const errorChannelId = "812079196469592074";
        const errorChannel = client.channels.cache.get(errorChannelId);
        errorChannel.send(errorEmbed).catch(() => {
            consoleLogColor("Red", "Failed to access errors channel!");
            console.error("Unhandled promise rejection:", error);
            return;
        });
    });
};
