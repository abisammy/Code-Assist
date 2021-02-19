// Not going to take credit this is the discord.js commando help command modified into an embed

const { stripIndents, oneLine } = require("common-tags");
const Command = require("discord.js-commando/src/commands/base");
const { MessageEmbed } = require("discord.js");
module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            group: "util",
            memberName: "help",
            aliases: ["commands", "h", "cmds"],
            description:
                "Displays a list of available commands, or detailed information for a specified command.",
            details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
            examples: ["help", "help prefix"],
            guarded: true,

            args: [
                {
                    key: "command",
                    prompt:
                        "Which command would you like to view the help for?",
                    type: "string",
                    default: "",
                },
            ],
        });
    }

    async run(msg, args) {
        const { channel, guild } = msg;
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("EMBED_LINKS")
        ) {
            channel.send(
                `I need the embed links permission in this channel to execute this command!`
            );
            return;
        }
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("VIEW_CHANNEL")
        ) {
            return;
        }
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        ) {
            const misingPermissiosEmbed = new MessageEmbed()
                .setAuthor(
                    `I am missing the send messages permission in this channel ❌`
                )
                .setColor("#FF0000")
                .setDescription(
                    `Please ask a server administrator to grant me it in this channel!`
                );

            channel.send(misingPermissiosEmbed);
            return;
        }
        // eslint-disable-line complexity
        const groups = this.client.registry.groups;
        const commands = this.client.registry.findCommands(
            args.command,
            false,
            msg
        );
        const showAll = args.command && args.command.toLowerCase() === "all";
        if (args.command && !showAll) {
            if (commands.length === 1) {
                let help = stripIndents`
                	${oneLine`
                		__Command **${commands[0].name}**:__ ${commands[0].description}
                		${commands[0].guildOnly ? " (Usable only in servers)" : ""}
                		${commands[0].nsfw ? " (NSFW)" : ""}
                	`}
                	**Format:** ${msg.anyUsage(
                        `${commands[0].name}${
                            commands[0].format ? ` ${commands[0].format}` : ""
                        }`
                    )}
                `;
                if (commands[0].aliases.length > 0)
                    help += `\n**Aliases:** ${commands[0].aliases.join(", ")}`;
                help += `\n${oneLine`
                	**Group:** ${commands[0].group.name}
                	(\`${commands[0].groupID}:${commands[0].memberName}\`)
                `}`;
                if (commands[0].details)
                    help += `\n**Details:** ${commands[0].details}`;
                if (commands[0].examples)
                    help += `\n**Examples:**\n${commands[0].examples.join(
                        "\n"
                    )}`;
                const explainEmbed = new MessageEmbed()
                    .setAuthor("Help")
                    .setDescription(help)
                    .setColor("#7289DA")
                    .addField(
                        `Links`,
                        `[github](https://github.com/abisammy/DJS-assist) **|** [apply to become a writer](https://forms.gle/fYWkeRuEX16zX8SHA) **|** [support server](https://discord.gg/QJcJ3McTQC)`
                    );
                msg.channel.send(explainEmbed);
            }
        } else {
            const helpEmbed = new MessageEmbed()
                .setTitle(`Help`)
                .setColor("#7289DA");
            const messages = [];

            helpEmbed.setDescription(
                `
                    
            To run a command in ${msg.guild ? msg.guild.name : "any server"},
            use ${Command.usage(
                "command",
                msg.guild ? msg.guild.commandPrefix : null,
                this.client.user
            )}.
            For example, ${Command.usage(
                "prefix",
                msg.guild ? msg.guild.commandPrefix : null,
                this.client.user
            )}.
            To run a command in this DM, simply use ${Command.usage(
                "command",
                null,
                null
            )} with no prefix.
                			Use ${this.usage(
                                "<command>",
                                null,
                                null
                            )} to view detailed information about a specific command.
                			Use ${this.usage(
                                "all",
                                null,
                                null
                            )} to view a list of *all* commands, not just available ones.
                			__**${
                                showAll
                                    ? "\n\nAll commands"
                                    : `\n\nAvailable commands in ${
                                          msg.guild || "this DM"
                                      }`
                            }**__
                            ${groups
                                .filter((grp) =>
                                    grp.commands.some(
                                        (cmd) =>
                                            !cmd.hidden &&
                                            (showAll || cmd.isUsable(msg))
                                    )
                                )
                                .map(
                                    (grp) => stripIndents`
                                    __${grp.name}__
                                    ${grp.commands
                                        .filter(
                                            (cmd) =>
                                                !cmd.hidden &&
                                                (showAll || cmd.isUsable(msg))
                                        )
                                        .map(
                                            (cmd) =>
                                                `**${cmd.name}:** ${
                                                    cmd.description
                                                }${cmd.nsfw ? " (NSFW)" : ""}`
                                        )
                                        .join("\n")}
                                `
                                )
                                .join("\n\n")}
                        `,
                { split: true }
            );

            stripIndents`
                            ${oneLine`
    
                                To run a command in ${
                                    msg.guild ? msg.guild.name : "any server"
                                },
                                use ${Command.usage(
                                    "command",
                                    msg.guild ? msg.guild.commandPrefix : null,
                                    this.client.user
                                )}.
                                For example, ${Command.usage(
                                    "prefix",
                                    msg.guild ? msg.guild.commandPrefix : null,
                                    this.client.user
                                )}.
                            `}
                            To run a command in this DM, simply use ${Command.usage(
                                "command",
                                null,
                                null
                            )} with no prefix.
                            Use ${this.usage(
                                "<command>",
                                null,
                                null
                            )} to view detailed information about a specific command.
                            Use ${this.usage(
                                "all",
                                null,
                                null
                            )} to view a list of *all* commands, not just available ones.
                            __**${
                                showAll
                                    ? "All commands"
                                    : `Available commands in ${
                                          msg.guild || "this DM"
                                      }`
                            }**__
                            ${groups
                                .filter((grp) =>
                                    grp.commands.some(
                                        (cmd) =>
                                            !cmd.hidden &&
                                            (showAll || cmd.isUsable(msg))
                                    )
                                )
                                .map(
                                    (grp) => stripIndents`
                                    __${grp.name}__
                                    ${grp.commands
                                        .filter(
                                            (cmd) =>
                                                !cmd.hidden &&
                                                (showAll || cmd.isUsable(msg))
                                        )
                                        .map(
                                            (cmd) =>
                                                `**${cmd.name}:** ${
                                                    cmd.description
                                                }${cmd.nsfw ? " (NSFW)" : ""}`
                                        )
                                        .join("\n")}
                                `
                                )
                                .join("\n\n")}
            		`,
                { split: true };
            helpEmbed.addField(
                `Links`,
                `[github](https://github.com/abisammy/DJS-assist) **|** [apply to become a writer](https://forms.gle/fYWkeRuEX16zX8SHA) **|** [support server](https://discord.gg/QJcJ3McTQC)`
            );
            msg.channel.send(helpEmbed);
        }
    }
};
