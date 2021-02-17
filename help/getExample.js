const fs = require("fs");

module.exports.value = (propertyToFindFixOf) => {
    var data = fs.readFileSync(
        `help/examples/${propertyToFindFixOf}example.txt`,
        "utf-8"
    );
    return data.replace(/(\r\n|\n|\r)/gm, "\n");
};
