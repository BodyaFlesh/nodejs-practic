/**
 * request handlers
 */

// dependencies
var _data = require("./data");
var helpers = require("./helpers");

//define the handlers
var handlers = {};

//users
handlers.users = function(data, callback) {
    let acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

//container for the users submethods
handlers._users = {};

// Users - post
// required data: firstName, lastName, phone, password, tosAgreement
// Optional : none
handlers._users.post = function(data, callback) {
    // Check that all required fileds are filled our
    let firstName = typeof data.payload.firstName == "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof data.payload.lastName == "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof data.payload.phone == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let tosAgreement = typeof data.payload.tosAgreement == "boolean" && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && tosAgreement) {
        // Make sure that the user doesnt already axist
        _data.read("users", phone, function(err, data) {
            if (err) {
                //hash the password
                let hashedPassword = helpers.hash(password);
            } else {
                // user already exists
                callback(400, { Error: "A user with that phone number already exists" });
            }
        });
    } else {
        callback(400, { Error: "Missing required fileds" });
    }
};

// Users - get
handlers._users.get = function(data, callback) {};

// Users - put
handlers._users.put = function(data, callback) {};

// Users - delete
handlers._users.delete = function(data, callback) {};

//not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

//ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

//export the module

module.exports = handlers;
