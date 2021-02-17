// Import the client
module.exports = (client) => {
    // When the client is ready
    client.once("ready", () => {
        // Change the status of the bot to watching js!help for help
        client.user.setPresence({
            status: "online",
            activity: {
                name: "js!help for help!",
                type: "WATCHING",
            },
        });

        // Log that the bot is online
        console.log("Bot is online");
    });
};
