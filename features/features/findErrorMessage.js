// Require the blakclistedGuilds.json file
const blacklistedUsers = require("@util/jsons/blacklistedUsers.json");

// Require the blakclistedUsers.json file
const blacklistedGuilds = require("@util/jsons/blacklistedGuilds.json");

// Require the findError.js file
const findError = require("@util/findError");

// Create a new Map called triggers
let triggers = new Map();

// Create an empty array for the triggers
let triggersArray = [];

// Create a function to add values to the map
function logMapElements(value, key) {
    for (const trigger in key) {
        triggers.set(key[trigger], value);
        triggersArray.push(key[trigger]);
    }
}

// Create a function to load the triggers, this will only run the first time a message is sent
function loadTriggers(client) {
    if (triggers.size === 0) {
        client.errorTriggers.forEach(logMapElements);
    } else {
        return;
    }
}

// Export the function requrieing the client
module.exports = (client) => {
    // When a message is sent
    client.on("message", (message) => {
        // Destructure the content, channel and guild from the message
        const { channel, guild, content: messageContent, author } = message;

        // If we dont have the view channel permission return
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("VIEW_CHANNEL")
        ) {
            return;
        }

        // If we we dontr have the send messages permission return
        if (
            channel.type !== "dm" &&
            !channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        ) {
            return;
        }

        // If the user is blacklisted return
        if (blacklistedUsers.hasOwnProperty(author.id)) {
            return;
        }

        // If the guild is blacklisted return
        if (
            channel.type !== "dm" &&
            blacklistedGuilds.hasOwnProperty(guild.id)
        ) {
            return;
        }

        // If the message starts with the prefix return
        if (channel.type !== "dm") {
            let prefix = guild.commandPrefix;

            if (messageContent.startsWith(prefix)) return;
        }

        // If the user is a bot return
        if (author.bot) {
            return;
        }

        // Load the triggers (this will only run once)
        loadTriggers(client);

        // Convert the message to lwoer case and no spaces, this will look like "Hello my name is abisammy#4749" to "hellomynameisabisammy#4749"
        let messageContentToLowerCase = messageContent
            .toLowerCase()
            .replace(/ /g, "");

        // For each of the triggers in the array
        for (const trigger of triggersArray) {
            // If the message includes the trigger
            if (messageContentToLowerCase.includes(trigger)) {
                // use findError.js to send it to the user
                let errorCode = triggers.get(trigger);
                findError(client, errorCode, message);
                break;

                // If it doesnt continue looping through
            } else {
                continue;
            }
        }
    });
};
