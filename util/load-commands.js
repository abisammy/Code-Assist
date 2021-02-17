module.exports = async (client) => {
    // Use path to find the commands folder, and then the folders in that folder and the command files themselves
    const path = require("path");

    // Register the default commands using discord.js commando
    client.registry
        .registerDefaultTypes()
        .registerDefaultGroups()
        .registerDefaultCommands({
            unknownCommand: false,
            eval: false,
            help: false,
            commandState: false,
            ping: false,
        })

        // Register our custom groups and commands using path and discord.js commando
        .registerGroups([
            ["misc", "Miscelanious commands not to do with coding"],
            ["basics", "These are the basics to help you get started"],
            ["errors", "Find your error here or diagnose it"],
            ["examples", "Some examples of code you can include!"],
        ])
        .registerCommandsIn(path.join(__dirname, "../commands"));

    /* This will add an inhibitator using discord.js commando
        What an inhibitor does is that it runs these lines of code, before each command is ran.
        In our case, we want to check the user is not blacklisted, the guild is not blacklisted and that the bot has permissions to speak in that channel.
        */
    client.dispatcher.addInhibitor((message) => {
        // This line allows us to send embeds
        const { MessageEmbed } = require("discord.js");

        // This destructures the channel and guild from the message, so we dont have to do message.guild.id for example, we can just do guild.id
        const { channel, guild, author } = message;

        // Make sure that if the command was ran in a server, that the bot has permissions to send messages

        // If the command is ran in a guild and the bot doesnt have permission to send messages then
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        ) {
            // Create an embed
            const missingPermisions = new MessageEmbed()
                .setAuthor(`I am missing permissions ❌`)
                .setColor("#FF0000")
                .setDescription(
                    `Please make sure I have the \`\`Send messages\`\` permission in <#${channel.id}>`
                );

            // Send the user the embed, instead of the channel. This is because if the bot doesnt have permissions to send messages in the channel, it needs to send the user.
            author
                .send(missingPermisions)

                // This .catch is a catch if the bot cant DM the user
                .catch(() => {
                    return "Missing permissions";
                });

            // If the bot could DM the user, it stills has to return
            return "Missing permissions";
        }

        // Find the blacklistedGuilds.json file
        const blacklistedGuilds = require("@util/jsons/blacklistedGuilds.json");

        // If the command is ran in a guild, and the guild is blacklisted then
        if (
            channel.type !== "dm" &&
            blacklistedGuilds.hasOwnProperty(guild.id)
        ) {
            // Defined guildId as the ID for easier use
            let guildId = guild.id;

            // If we don't have embed permissions in the chanel, send it as text
            if (!channel.permissionsFor(guild.me).has("EMBED_LINKS")) {
                return {
                    reason: "blacklisted",
                    response: channel.send(
                        `This discord server is blacklisted from running commands, Reason: \`\`${blacklistedGuilds[guildId]}\`\``
                    ),
                };

                // However if we do, send it as an embed
            } else {
                const blacklistedGuildEmbed = new MessageEmbed()
                    .setAuthor(`Blacklisted Server ❌`)
                    .setColor("#000000")
                    .setDescription(
                        `This discord server is blacklisted from running commands, Reason: \`\`${blacklistedGuilds[guildId]}\`\``
                    );

                return {
                    reason: "blacklisted",
                    response: channel.send(blacklistedGuildEmbed),
                };
            }
        }

        // Define the userId for easier use
        let userId = author.id;

        // Find the blacklistedUsers.json file
        const blacklistedUsers = require("@util/jsons/blacklistedUsers.json");

        // If the user running is found in the blacklistedUsers.json file then
        if (blacklistedUsers.hasOwnProperty(userId)) {
            // If the channel is in a guild, and the bot doesnt have permissions to send embeds then send it as text
            if (
                channel.type !== "dm" &&
                !channel.permissionsFor(guild.me).has("EMBED_LINKS")
            ) {
                return {
                    reason: "blacklisted",
                    response: channel.send(
                        `You have been blacklisted from running commands with this bot, Reason: \`\`${blacklistedUsers[userId]}\`\``
                    ),
                };

                // However if the bot does have permissions to send embeds, or the user ran the command in DM's then send it as a embed
            } else {
                const blacklisedUserEmbed = new MessageEmbed()
                    .setAuthor(`Blacklisted User ❌`)
                    .setColor("#000000")
                    .setDescription(
                        `You have been blacklisted from running commands with this bot, Reason: \`\`${blacklistedUsers[userId]}\`\``
                    );

                return {
                    reason: "blacklisted",
                    response: channel.send(blacklisedUserEmbed),
                };
            }
        }
    });
};
