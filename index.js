// Require dotenv and module alias npm packages
require("dotenv");
require("module-alias/register");

// Find the startup file
const startup = require("@util/startup");

// Require discord.js commando
const Commando = require("discord.js-commando");

// Create the client
const client = new Commando.CommandoClient({
    owner: "468128787884670986",
    commandPrefix: "js!",
});

startup(client);
