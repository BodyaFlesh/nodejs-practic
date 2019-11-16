/**
 * Primary for the API
 */

//Dependencies
const http = require("http");
const url = require("url");

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

    // Send the response
    res.end("Hello world\n");

    // Log the request path
    console.log("request received on path:", trimmedPath);
    console.log("Method:", method);
    console.log(quertStringObject);
});

//start the server, and have it listen on port 3000
server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
});
