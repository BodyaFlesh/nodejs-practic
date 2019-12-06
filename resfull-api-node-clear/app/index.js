/**
 * Primary for the API
 */

//dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");

// declare the app
var app = {};

// Init
app.init = function() {
    // Start the server
    server.init();

    // start the workers
    workers.init();

    //Start the CLI, but make it starts last
    setTimeout(function() {
        cli.init();
    }, 50);
};

// Execute
app.init();

//export the app
module.exports = app;
