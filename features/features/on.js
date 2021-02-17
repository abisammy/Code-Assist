module.exports = (client) => {
    client.on("ready", () => {
        client.user.setPresence({
            status: "online",
            activity: {
                name: "js!help for help!",
                type: "WATCHING",
            },
        });
        console.log("Features work OH YEAH");
    });
};
