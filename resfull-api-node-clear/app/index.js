/**
 * Primary for the API
 */

//Dependencies
const http = require("http");

//the server should respond to all requests with a string
const server = http.createServer(function(req, res) {
    res.end("Hello world\n");
});

//start the server, and have it listen on port 3000
server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
});