const Commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

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
        const { channel, guild } = message;

        const introEmbed = new MessageEmbed()
            .setAuthor(`Hello!`)
            .setColor("#7289DA")
            .setDescription(
                `**My name is ${this.client.user.username}!** \n\nI help you with your basic coding problems, with the discord.js library.\n This allows you to create your own bot! \nHowever, over the past few months, I have noticed a lot of people require help with the same problems that can easily be solved.\n\n Before we start check out the [discord.js library here](https://discord.js.org/#/docs/main/stable/general/welcome)\n\n**Here are some commands to get you started!**`
            )
            .addField(
                `${guild.commandPrefix}help`,
                `Displays all the commands for the bot or help with one specific command!`
            )
            .addField(
                `${guild.commandPrefix}sendcode`,
                `This command teaches you how to send code in a server, to both help you and the people helping you!`
            )
            .addField(
                `${guild.commandPrefix}youtube`,
                `This command has a few youtube series I recommend you check out for learning discord.js`
            );

        channel.send(introEmbed);
    };
};
