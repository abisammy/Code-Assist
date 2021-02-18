// require discord.js commando and message embed for the command
const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

// Create the command
module.exports = class IntroCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "intro",
            group: "basics",
            memberName: "intro",
            description: "Tells what the bot is about",
        });
    }
    run = async (message) => {
        // Destructure the channel and the guild from the message
        const { channel, guild } = message;

        // Create the command prefix whether the command was ran in a DM or in a servr
        let commandPrefix = channel.type !== "dm" ? guild.commandPrefix : "";

        // Create the embed and send it
        const introEmbed = new MessageEmbed()
            .setAuthor(`Hello!`)
            .setColor("#7289DA")
            .setDescription(
                `**My name is ${this.client.user.username}!** \n\nI help you with your basic coding problems, with the discord.js library.\n This allows you to create your own bot! \nHowever, over the past few months, I have noticed a lot of people require help with the same problems that can easily be solved.\n\n Before we start check out the [discord.js library here](https://discord.js.org/#/docs/main/stable/general/welcome)\n\n**Here are some commands to get you started!**`
            )
            .addField(
                `${commandPrefix}help`,
                `Displays all the commands for the bot or help with one specific command!`
            )
            .addField(
                `${commandPrefix}examples`,
                `This gives you multiple examples you could use, such as how to send code in a discord server!`
            )
            .addField(
                `${commandPrefix}errors`,
                `This gives you all the errors that you might encounter that the bot has a solution to`
            )
            .addField(
                `${commandPrefix}youtube`,
                `This command has a few youtube series I recommend you check out for learning discord.js`
            );

        channel.send(introEmbed);
    };
};
