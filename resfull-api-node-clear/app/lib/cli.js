/**
 * CLI -related Tasks
 */

//Dependencies
const readLine = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
var e = new _events();

// Instantiate the CLI module object
var cli = {};

//Input processor
cli.processInput = function(str) {
    str = typeof str == "string" && str.trim().length > 0 ? str.trim() : false;
    //Only process the input if the user actually wrote something. Otherwise ignore it
    if (str) {
        // Codify the unique string that identify the unique questions allowed to be a
        let uniqueInputs = ["man", "help", "exit", "stats", "list users", "more user info", "list checks", "more check into", "list logs", "more log info"];

        // Go through the possible inputs, emit an event when a match is found
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some(function(input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input, and include the full string given
                e.emit(input, str);
                return true;
            }
        });

        // If no match is found, tell the user to try again
        if (!matchFound) {
            console.log("Sorry, try again");
        }
    }
};

// Init script
cli.init = function() {
    // Send the start message to the console, in dark blue
    console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

    // Start the interface
    var _interface = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ""
    });

    // Create an initial promp
    _interface.prompt();

    // Handler each line of input separately
    _interface.on("line", function(str) {
        // Send to the input processor
        cli.processInput(str);

        //Re-initialize the propt afterwards
    });

    //If the user stops the CLI, kill the associated process
    _interface.on("clise", function() {
        process.exit(0);
    });
};

// Export the module
module.exports = cli;
