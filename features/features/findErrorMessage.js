const blacklistedUsers = require("@util/jsons/blacklistedUsers.json");
const blacklistedGuilds = require("@util/jsons/blacklistedGuilds.json");
const findError = require("@util/findError");
let triggers = new Map();
let triggersArray = [];
function logMapElements(value, key) {
    for (const trigger in key) {
        triggers.set(key[trigger], value);
        triggersArray.push(key[trigger]);
    }
}
function loadTriggers(client) {
    if (triggers.size === 0) {
        client.errorTriggers.forEach(logMapElements);
    } else {
        return;
    }
}
module.exports = (client) => {
    client.on("message", (message) => {
        const { channel, guild, content: messageContent, author } = message;

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
            return;
        }

        if (blacklistedUsers.hasOwnProperty(author.id)) {
            return;
        }
        if (
            channel.type !== "dm" &&
            blacklistedGuilds.hasOwnProperty(guild.id)
        ) {
            return;
        }
        if (channel.type !== "dm") {
            let prefix = guild.commandPrefix;

            if (messageContent.startsWith(prefix)) return;
        }

        if (author.bot) {
            return;
        }

        loadTriggers(client);

        let messageContentToLowerCase = messageContent
            .toLowerCase()
            .replace(/ /g, "");

        for (const trigger of triggersArray) {
            if (messageContentToLowerCase.includes(trigger)) {
                let errorCode = triggers.get(trigger);
                findError(client, errorCode, message);
                break;
            } else {
                continue;
            }
        }
    });
};
