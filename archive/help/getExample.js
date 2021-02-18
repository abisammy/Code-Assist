// require fs
const fs = require("fs");

// Export the value of the text that we find
module.exports.value = (propertyToFindFixOf) => {
    // Load the data from the txt files
    var data = fs.readFileSync(
        // Find the file in help/examples/the_flename_we_requested_example.txt
        // NOTE: All fix files need ot end with .txt
        `help/examples/${propertyToFindFixOf}example.txt`,

        // Define its a utf-8 file which is just a text file
        "utf-8"
    );

    /* Return the data and replace each line with \n, this is good as it converts it nicely to an embed description for us,
     all we need to do is write the text */
    return data.replace(/(\r\n|\n|\r)/gm, "\n");
};
