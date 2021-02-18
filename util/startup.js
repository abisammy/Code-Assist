module.exports = (client) => {
    // Get mongoclient and mongodb provider for the custom guild prefix
    const MongoClient = require("mongodb").MongoClient;

    const MongoDBProvider = require("commando-provider-mongo").MongoDBProvider;

    // Get the mongopath and the client
    const MONGOPATH = process.env.MONGOPATH;
    const TOKEN = process.env.TOKEN;

    // Find the load-commands.js file
    const loadCommands = require("@util/load-commands");

    // Find the load-features.js file
    const loadFeatures = require("@root/features/load-features");

    // set the provider, and connect to mongo
    client.setProvider(
        MongoClient.connect(MONGOPATH).then(
            (client) => new MongoDBProvider(client, "JS-assist")
        )
    );

    client.login(TOKEN);

    // Load the commands in
    loadCommands(client);

    // Load the features in
    loadFeatures(client);
};
