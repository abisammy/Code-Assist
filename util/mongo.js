// Find the mognoose npm package
const mongoose = require("mongoose");

// Find the mongopath
const MONGOPATH = process.env.MONGOPATH3;

// Connect to mongo
module.exports = async () => {
    await mongoose.connect(MONGOPATH, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    return mongoose;
};
