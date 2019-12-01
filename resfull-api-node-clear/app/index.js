/**
 * Primary for the API
 */

//dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");

// declare the app
var app = {};

// Init
app.init = function() {
    // Start the server
    server.init();

    // start the workers
    workers.init();
};

// Execute
app.init();

//export the app
module.exports = app;
