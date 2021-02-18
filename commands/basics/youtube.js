// Get commando and destructure MessageEmbed from discord.js
const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

// Create the youtube command
module.exports = class YoutubeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "youtube",
            aliases: ["yt"],
            group: "basics",
            memberName: "youtube",
            description:
                "A few youtube series recommended for beginers to learn discord.js",
        });
    }
    run = async (message) => {
        // Destructure the channel from the message
        const { channel } = message;

        // Create the embed and send it
        const youtubeEmbed = new MessageEmbed()
            .setAuthor(
                `Here are a few youtube series, that I think you should check out to learn discord.js`
            )
            .setColor("#7289DA")
            .addField(
                "Code Lyon",
                "Codelyon is perfect for learning the basics of discord.js, such as logging into your bot or making you very first command handlers. \n[Watch his series](https://www.youtube.com/watch?v=j_sD9udZnCk&list=PLbbLC0BLaGjpyzN1rg-gK4dUqbn8eJQq4)\n[Join his discord server](https://discord.gg/Mdm5yMs5tc)"
            )
            .addField(
                "Worn Off Keys",
                "Trying to learn how to connect your discord bot to mongoDB? Worn Off Keys has a amazing over 80 episode long series! \n[Watch the series](https://www.youtube.com/watch?v=gV4iltEdBs4&list=PLaxxQQak6D_fxb9_-YsmRwxfw5PH9xALe)\n[Check out his discord server](https://discord.com/invite/Ra9BSSs)"
            );

        channel.send(youtubeEmbed);
    };
};
