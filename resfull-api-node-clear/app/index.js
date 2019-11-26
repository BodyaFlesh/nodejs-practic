/**
 * Primary for the API
 */

//Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

//the server should respond to all requests with a string
const server = http.createServer(function(req, res) {
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
            res.writeHead(statusCode);
            res.end(payloadString);

            //log the request path
            console.log("Returning this response: ", statusCode, payloadString);
        });

        console.log("Peyload", buffer);
    });

    // Send the response
    // res.end("Hello world\n");

    // // Log the request path
    // // console.log("request received on path:", trimmedPath);
    // // console.log("Method:", method);
    // // console.log(quertStringObject);

    // console.log("Headers", headers);
});

//start the server, and have it listen on port 3000
server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
});

//define the handlers
var handlers = {};

//sample heandler
handlers.sample = function(data, callback) {
    //callback a http status code, and a payload object
    callback(406, { name: "sample handler" });
};

//not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

//define a request router
var router = {
    sample: handlers.sample
};
