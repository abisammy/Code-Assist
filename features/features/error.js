// Export the function, requiring the client
module.exports = (client) => {
    // require MessageEmbed from discord.js
    const { MessageEmbed } = require(`discord.js`);

    // Require the colors.json file. This just has a database of all the colors you can console.log with in nod.js
    const colors = require("@util/jsons/colors.json");

    // Create a function to console.log with colors
    function consoleLogColor(color, text) {
        console.log(`\x1b[${colors[color]}m%s\x1b[0m`, text);
    }

    // When an discord API error occurs
    process.on("unhandledRejection", (error) => {
        // Create an embed
        const errorEmbed = new MessageEmbed()
            .setAuthor(`There has been an error!`)
            .setColor("#FF0000")
            .setDescription(`Error message: \`\`\`${error}\`\`\``);

        // Defiend the channel Id
        const errorChannelId = "812079196469592074";

        // Find the channel
        const errorChannel = client.channels.cache.get(errorChannelId);

        // Try to send the embed
        errorChannel.send(errorEmbed).catch(() => {
            // If there was an error sending the error, console.log it (isnt it ironic, having an error sending an error)
            consoleLogColor("Red", "Failed to access errors channel!");
            console.error("Unhandled promise rejection:", error);
            return;
        });
    });
};
