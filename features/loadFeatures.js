/* I am not going to note this one as this was made by a tutorial made by Worn Off Keys
Check it out here:
https://www.youtube.com/watch?v=WWeDV2_njiw
*/
const path = require("path");
const fs = require("fs");

module.exports = (client) => {
    const colors = require("@util/jsons/colors.json");

    function consoleLogColor(color, text) {
        console.log(`\x1b[${colors[color]}m%s\x1b[0m`, text);
    }

    const readFeatures = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readFeatures(path.join(dir, file));
            } else if (file !== "loadFeatures.js") {
                const feature = require(path.join(__dirname, dir, file));
                consoleLogColor("Cyan", `Enabling feature "${file}"`);
                feature(client);
            }
        }
    };

    readFeatures(".");
};
