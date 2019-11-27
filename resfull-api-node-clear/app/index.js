/**
 * Primary for the API
 */

//Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
const _data = require("./lib/data");

//testing
// @TODO delete this
_data.create("test", "newFile", { foo: "bar" }, function(err) {
    console.log("this was the error", err);
});

//Instatiate the http server
const httpServer = http.createServer(function(req, res) {
    unifuedServer(req, res);
});

//start the server
httpServer.listen(config.httpPort, function() {
    console.log(
        "The server is listening on port " +
            config.httpPort +
            " in " +
            config.envName +
            " now"
    );
});

//Instatiate the https server
const httpsServerOptions = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem")
};
const httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifuedServer(req, res);
});

//start the https server
httpsServer.listen(config.httpsPort, function() {
    console.log(
        "The server is listening on port " +
            config.httpsPort +
            " in " +
            config.envName +
            " now"
    );
});

// all the server logic for bith the http and https server
var unifuedServer = function(req, res) {
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
        var chosenHandler =
            typeof router[trimmedPath] !== "undefined"
                ? router[trimmedPath]
                : handlers.notFound;

        //construct the data object to send to the handler
        var data = {
            trimmedPath: trimmedPath,
            queryStringObject: quertStringObject,
            method: method,
            headers: headers,
            payload: buffer
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

//define the handlers
var handlers = {};

//sample heandler
// handlers.sample = function(data, callback) {
//     //callback a http status code, and a payload object
//     callback(406, { name: "sample handler" });
// };

//not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

//ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

//define a request router
var router = {
    ping: handlers.ping
};
