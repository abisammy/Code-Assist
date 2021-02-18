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
        loadTriggers(client);

        if (channel.type !== "dm") {
            let prefix = guild.commandPrefix;

            if (messageContent.startsWith(prefix)) return;
        }

        if (author.bot) {
            return;
        }

        let messageContentToLowerCase = messageContent
            .toLowerCase()
            .replace(/ /g, "");

        if (triggersArray.includes(messageContentToLowerCase)) {
            for (const trigger of triggersArray) {
                if (messageContentToLowerCase.includes(trigger)) {
                    let errorCode = triggers.get(trigger);
                    findError(client, errorCode, message);
                } else {
                    continue;
                }
            }
        }
    });
};
