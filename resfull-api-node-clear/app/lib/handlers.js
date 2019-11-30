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
    var password = typeof data.payload.password == "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof data.payload.tosAgreement == "boolean" && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && tosAgreement) {
        // Make sure that the user doesnt already axist
        _data.read("users", phone, function(err, data) {
            if (err) {
                //hash the password
                let hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    // create the user object
                    let userObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement
                    };

                    //store the user
                    _data.create("users", phone, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { Error: "A user with that phone number already exists" });
                        }
                    });
                } else {
                    callback(500, { Error: "Could not create the new user" });
                }
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
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Bon't let them access anyone elses
handlers._users.get = function(data, callback) {
    // Check that the phone number is valid
    let phone =
        typeof data.queryStringObject.phone == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // lookup the user
        _data.read("users", phone, function(err, data) {
            if (!err && data) {
                // Remove the hashed password from the use object before returning it to the requester
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated use update their own object. Don't let them update anyone else's
handlers._users.put = function(data, callback) {
    // Check for the required field
    let phone = typeof data.payload.phone == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    console.log({ phone });

    // check for the optional fields
    let firstName = typeof data.payload.firstName == "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof data.payload.lastName == "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof data.payload.password == "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is invalid
    if (phone) {
        // Error if noting is sent to update
        if (firstName || lastName || password) {
            // lookup the user
            _data.read("users", phone, function(err, userData) {
                if (!err && userData) {
                    //update the fields necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // store the new udates
                    _data.update("users", phone, userData, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { Error: "Could not update the user" });
                        }
                    });
                } else {
                    callback(400, { Error: "The specified user does not exist" });
                }
            });
        } else {
            callback(400, { Error: "Missing fields to update" });
        }
    } else {
        callback(400, { Error: "missing required field" });
    }
};

// Users - delete
// Required field: phone
// @TODO Only let an authenticated user delete their object. Dont let them delete anyone else's
// @TODO Cleanup (dalete) any other data files associated with this user
handlers._users.delete = function(data, callback) {
    // Check that the phone number is valid
    let phone =
        typeof data.queryStringObject.phone == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // lookup the user
        _data.read("users", phone, function(err, data) {
            if (!err && data) {
                _data.delete("users", phone, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { Error: "Could not delete the specifield user" });
                    }
                });
            } else {
                callback(400, { Error: "Could not find the specified user" });
            }
        });
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

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
