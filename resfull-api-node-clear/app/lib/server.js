/**
 * Server-related tasks
 */

//Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
const handlers = require("./handlers");
const helpers = require("./helpers");
const path = require("path");

// Instantiate the server module object
var server = {};

// @TODO GET RID OF THIS
// helpers.sendTwilioSms("4151234567", "Hello!", function(err) {
//     console.log("This was the error", err);
// });

//Instatiate the http server
server.httpServer = http.createServer(function(req, res) {
    server.unifuedServer(req, res);
});

//Instatiate the https server
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "/..//https/cert.pem"))
};
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res) {
    server.unifuedServer(req, res);
});

// all the server logic for bith the http and https server
server.unifuedServer = function(req, res) {
    // Get the URL and parse it
    var parseUrl = url.parse(req.url, true);

    // Get the path
    var path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string as an object
    var quertStringObject = parseUrl.query;

    //Get the HTTP Method
    var method = req.method.toLowerCase();

    //get the headers as an oject
    var headers = req.headers;

    // get the payload, if any
    var decoder = new StringDecoder("utf-8");
    var buffer = "";
    req.on("data", function(data) {
        buffer += decoder.write(data);
    });
    req.on("end", function() {
        buffer += decoder.end();

        //choose the halder this request should go to. If one is not found, use the not found handler
        var chosenHandler = typeof server.router[trimmedPath] !== "undefined" ? server.router[trimmedPath] : handlers.notFound;

        //construct the data object to send to the handler
        var data = {
            trimmedPath: trimmedPath,
            queryStringObject: quertStringObject,
            method: method,
            headers: headers,
            payload: helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            // Use the status code called back b the handler, or default to 200
            statusCode = typeof statusCode == "number" ? statusCode : 200;

            // use the payload called back by the handler, or default to an empty object
            payload = typeof payload == "object" ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // return response
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadString);

            //log the request path
            console.log("Returning this response: ", statusCode, payloadString);
        });

        console.log("Peyload", buffer);
    });
};

//define a request router
server.router = {
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};

// Init script
server.init = function() {
    //start the HTTP server
    server.httpServer.listen(config.httpPort, function() {
        console.log("The server is listening on port " + config.httpPort + " in " + config.envName + " now");
    });

    //start the HTTPS server
    server.httpsServer.listen(config.httpsPort, function() {
        console.log("The server is listening on port " + config.httpsPort + " in " + config.envName + " now");
    });
};

module.exports = server;