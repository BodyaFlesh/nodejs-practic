/**
 * library for staring and editing data
 */

// dependencies
const fs = require("fs");
const path = require("path");

// container for the module (to be exported)
var lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// write data to a file
lib.create = function(dir, file, data, callback) {
    // open the file for writing
    fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", function(
        err,
        fileDescriptor
    ) {
        if (!err && fileDescriptor) {
            // convert data to string
            var stringData = JSON.stringify(data);

            //write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function() {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("Error closing new file");
                        }
                    });
                } else {
                    callback("Error writing to new file");
                }
            });
        } else {
            callback("Could not create new file, it may already axist");
        }
    });
};

//export the module
module.exports = lib;
