/**
 * request handlers
 */

// dependencies
const _data = require("./data");
const helpers = require("./helpers");
const config = require("./config");

//define the handlers
var handlers = {};

/**
 * HTML handlers
 */

//Index handler
handlers.index = function(data, callback) {
    // reject any request that isn't a GET
    if (data.method == "get") {
        // Prepare data for interpolation
        let templateData = {
            "head.title": "Uptime Monitoring - Made Simple",
            "head.description":
                "We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we'll send you a text to let you know.",
            "body.class": "index"
        };

        // Read in a template as a string
        helpers.getTemplate("index", templateData, function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    console.log({ err, str });
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};

// Create account
handlers.accountCreate = function(data, callback) {
    // reject any request that isn't a GET
    if (data.method == "get") {
        // Prepare data for interpolation
        let templateData = {
            "head.title": "Create an Account",
            "head.description": "Sugnup is easy and only takes a few seconds.",
            "body.class": "accountCreate"
        };

        // Read in a template as a string
        helpers.getTemplate("accountCreate", templateData, function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    console.log({ err, str });
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};

// Create new session
handlers.sessionCreate = function(data, callback) {
    // reject any request that isn't a GET
    if (data.method == "get") {
        // Prepare data for interpolation
        let templateData = {
            "head.title": "Login to your account",
            "head.description": "Please enter ...",
            "body.class": "sessionCreate"
        };

        // Read in a template as a string
        helpers.getTemplate("sessionCreate", templateData, function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    console.log({ err, str });
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};

// Session has been deleted
handlers.sessionDeleted = function(data, callback) {
    // reject any request that isn't a GET
    if (data.method == "get") {
        // Prepare data for interpolation
        let templateData = {
            "head.title": "Logout",
            "head.description": "You have been logged",
            "body.class": "sessionDeleted"
        };

        // Read in a template as a string
        helpers.getTemplate("sessionDeleted", templateData, function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    console.log({ err, str });
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};

// Edit your account
handlers.accountEdit = function(data, callback) {
    // reject any request that isn't a GET
    if (data.method == "get") {
        // Prepare data for interpolation
        let templateData = {
            "head.title": "Account Settings",
            "body.class": "accountEdit"
        };

        // Read in a template as a string
        helpers.getTemplate("accountEdit", templateData, function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    console.log({ err, str });
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};

// Favicon
handlers.favicon = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method == "get") {
        // Read in the favicon's data
        helpers.getStaticAsset("favicon.ico", function(err, data) {
            if (!err && data) {
                // Callback the data
                callback(200, data, "favicon");
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};

// Public assets
handlers.public = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method == "get") {
        // Get the filename being requested
        var trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
        if (trimmedAssetName.length > 0) {
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, function(err, data) {
                if (!err && data) {
                    // Determine the content type (default to plain text)
                    let contentType = "plain";

                    if (trimmedAssetName.indexOf(".css") > -1) {
                        contentType = "css";
                    }

                    if (trimmedAssetName.indexOf(".png") > -1) {
                        contentType = "png";
                    }

                    if (trimmedAssetName.indexOf(".jpg") > -1) {
                        contentType = "jpg";
                    }

                    if (trimmedAssetName.indexOf(".ico") > -1) {
                        contentType = "favicon";
                    }

                    // Callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }
            });
        } else {
            callback(404);
        }
    } else {
        callback(405);
    }
};

/**
 * JSON API handlers
 */

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
handlers._users.get = function(data, callback) {
    // Check that the phone number is valid
    let phone =
        typeof data.queryStringObject.phone == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // get the token from the headers
        let token = typeof data.headers.token == "string" ? data.headers.token : false;
        //verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
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
                callback(403, { Error: "Missing required token in header, or token is invalid" });
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

    // check for the optional fields
    let firstName = typeof data.payload.firstName == "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof data.payload.lastName == "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof data.payload.password == "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is invalid
    if (phone) {
        // Error if noting is sent to update
        if (firstName || lastName || password) {
            // get the token from the headers
            let token = typeof data.headers.token == "string" ? data.headers.token : false;
            //verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
                if (tokenIsValid) {
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
                    callback(403, { Error: "Missing required token in header, or token is invalid" });
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
handlers._users.delete = function(data, callback) {
    // Check that the phone number is valid
    let phone =
        typeof data.queryStringObject.phone == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // get the token from the headers
        let token = typeof data.headers.token == "string" ? data.headers.token : false;
        //verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
                // lookup the user
                _data.read("users", phone, function(err, userData) {
                    if (!err && userData) {
                        _data.delete("users", phone, function(err) {
                            if (!err) {
                                // Delete each of the checks associated with the user
                                let userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];
                                let checksToDelete = userChecks.length;
                                if (checksToDelete > 0) {
                                    let checksDeleted = 0;
                                    let deletionErrors = false;
                                    // loop through the checks
                                    userChecks.forEach(function(checkId) {
                                        // delete the check
                                        _data.delete("checks", checkId, function(err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            checksDeleted++;
                                            if (checksDeleted == checksToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        Error:
                                                            "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully"
                                                    });
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, { Error: "Could not delete the specifield user" });
                            }
                        });
                    } else {
                        callback(400, { Error: "Could not find the specified user" });
                    }
                });
            } else {
                callback(403, { Error: "Missing required token in header, or token is invalid" });
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

//tokens
handlers.tokens = function(data, callback) {
    var acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// required data: phone, password
// optional data: none
handlers._tokens.post = function(data, callback) {
    let phone = typeof data.payload.phone == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof data.payload.password == "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (phone && password) {
        //lookup the use who matches that phone number
        _data.read("users", phone, function(err, userData) {
            if (!err && userData) {
                // hash the sent password, and compare it to the password stored in the use object
                let hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.hashedPassword) {
                    // if valid, create a new token with a random name. Set expiration date 1 hour in the future.
                    let tokenId = helpers.createRandomString(20);

                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        phone,
                        id: tokenId,
                        expires
                    };

                    // store the token
                    _data.create("tokens", tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { Error: "Could not create the new token." });
                        }
                    });
                } else {
                    callback(400, { Error: "Password did not match the specified user's stored password" });
                }
            } else {
                callback(400, { Error: "Could not find the specified user" });
            }
        });
    } else {
        callback(400, { error: "Missing required field(s)" });
    }
};

// Tokens - get
// required data: id
// Optional data: none
handlers._tokens.get = function(data, callback) {
    // Check that the id is valid
    let id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // lookup the token
        _data.read("tokens", id, function(err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function(data, callback) {
    let id = typeof data.payload.id == "string" && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    let extend = typeof data.payload.extend == "boolean" && data.payload.extend == true ? true : false;
    if (id && extend) {
        _data.read("tokens", id, function(err, tokenData) {
            if (!err && tokenData) {
                // check to the make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    // set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    //store the new updates
                    _data.update("tokens", id, tokenData, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { Error: "Could not update the token's expiration" });
                        }
                    });
                } else {
                    callback(400, { error: "The token has already expired, and cannot be extended" });
                }
            } else {
                callback(400, { error: "Specified token does not exist" });
            }
        });
    } else {
        callback(400, { Error: "Missing required filed(s) are invalid" });
    }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function(data, callback) {
    // Check that the id is valid
    let id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // lookup the user
        _data.read("tokens", id, function(err, data) {
            if (!err && data) {
                _data.delete("tokens", id, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { Error: "Could not delete the specifield token" });
                    }
                });
            } else {
                callback(400, { Error: "Could not find the specified token" });
            }
        });
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback) {
    // lookup the token
    _data.read("tokens", id, function(err, tokenData) {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

//checks
handlers.checks = function(data, callback) {
    var acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for all the checks methods
handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, sucessCodes,  timeoutSeconds
// Optional data: none
handlers._checks.post = function(data, callback) {
    // Validate inputs
    let protocol = typeof data.payload.protocol == "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    let url = typeof data.payload.url == "string" && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let method = typeof data.payload.method == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    let successCodes =
        typeof data.payload.successCodes == "object" && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0
            ? data.payload.successCodes
            : false;
    let timeoutSeconds =
        typeof data.payload.timeoutSeconds == "number" &&
        data.payload.timeoutSeconds % 1 === 0 &&
        data.payload.timeoutSeconds >= 1 &&
        data.payload.timeoutSeconds <= 5
            ? data.payload.timeoutSeconds
            : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get the token from the headers
        let token = typeof data.headers.token == "string" ? data.headers.token : false;

        //lookup the user by reading the token
        _data.read("tokens", token, function(err, tokenData) {
            if (!err && tokenData) {
                let userPhone = tokenData.phone;

                //looken the user data
                _data.read("users", userPhone, function(err, userData) {
                    if (!err && userData) {
                        let userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];
                        // verify that the user has less than the number of max-checks-per-user
                        if (userChecks.length < config.maxChecks) {
                            // create a random id for the check
                            let checkId = helpers.createRandomString(20);

                            // Create the check object, and include the user's phone
                            let checkObject = {
                                id: checkId,
                                userPhone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeoutSeconds
                            };

                            // save the ibject
                            _data.create("checks", checkId, checkObject, function(err) {
                                if (!err) {
                                    // add the check id to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    // save the new user data
                                    _data.update("users", userPhone, userData, function(err) {
                                        if (!err) {
                                            // return the data about the new check
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, { Error: "Could not update the user with the new check" });
                                        }
                                    });
                                } else {
                                    callback(500, { Error: "Could not the new check" });
                                }
                            });
                        } else {
                            callback(400, { Error: "The user already has the maximum number of checks (" + config.maxChecks + ")" });
                        }
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(403);
            }
        });
    } else {
        callback(400, { Error: "Misiing required input, or inputs are invalid" });
    }
};

//check - get
// Required data: id
// optional data: none
handlers._checks.get = function(data, callback) {
    // Check that the id is valid
    let id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // lookup the check
        _data.read("checks", id, function(err, checkData) {
            if (!err && checkData) {
                // get the token is valid and belongs to the use who created the check
                let token = typeof data.headers.token == "string" ? data.headers.token : false;
                //verify that the given token is valid for the phone number
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                    if (tokenIsValid) {
                        // reeturn the check data
                        callback(200, checkData);
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

// checks - put
// required data: id
// optional data: protocol, url, method, sucessCodes, timeoutSeconds
handlers._checks.put = function(data, callback) {
    // Check for the required field
    let id = typeof data.payload.id == "string" && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

    // check for the optional fields
    let protocol = typeof data.payload.protocol == "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    let url = typeof data.payload.url == "string" && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let method = typeof data.payload.method == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    let successCodes =
        typeof data.payload.successCodes == "object" && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0
            ? data.payload.successCodes
            : false;
    let timeoutSeconds =
        typeof data.payload.timeoutSeconds == "number" &&
        data.payload.timeoutSeconds % 1 === 0 &&
        data.payload.timeoutSeconds >= 1 &&
        data.payload.timeoutSeconds <= 5
            ? data.payload.timeoutSeconds
            : false;

    //check to make sure id is valid
    if (id) {
        //check to make sure or more optional fields has been sent
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // lookup the check
            _data.read("checks", id, function(err, checkData) {
                if (!err && checkData) {
                    // get the token is valid and belongs to the use who created the check
                    let token = typeof data.headers.token == "string" ? data.headers.token : false;
                    //verify that the given token is valid for the phone number
                    handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                        if (tokenIsValid) {
                            // Update the check where necessary
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }

                            _data.update("checks", id, checkData, function(err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, { Error: "Could not update the check" });
                                }
                            });
                        } else {
                            callback(403);
                        }
                    });
                } else {
                    callback(400, { Error: "Check ID did ot exist" });
                }
            });
        } else {
            callback(400, { Error: "Missing fields to update" });
        }
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

// Checks - delete
// required data: id
// optional data: none
handlers._checks.delete = function(data, callback) {
    // Check that the phone number is valid
    let id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // lookup the check
        _data.read("checks", id, function(err, checkData) {
            if (!err && checkData) {
                // get the token from the headers
                let token = typeof data.headers.token == "string" ? data.headers.token : false;
                //verify that the given token is valid for the phone number
                handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                    if (tokenIsValid) {
                        // delete the check data
                        _data.delete("checks", id, function(err) {
                            if (!err) {
                                // lookup the user
                                _data.read("users", checkData.userPhone, function(err, userData) {
                                    if (!err && checkData) {
                                        let userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];

                                        // remove the delete check from their list of checks
                                        let checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            // Re-sava the user's data
                                            _data.update("users", checkData.userPhone, userData, function(err) {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, { Error: "Could not update the user" });
                                                }
                                            });
                                        } else {
                                            callback(500, { Error: "Could not find the check on the users object, so could not remove it" });
                                        }
                                    } else {
                                        callback(500, {
                                            Error:
                                                "Could not find the user who created the check, so could not remove the check from the list of check from users object"
                                        });
                                    }
                                });
                            } else {
                                callback(500, { Error: "Could not delete the check data" });
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, { Error: "The specied check ID does not exist" });
            }
        });
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

//ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

//export the module

module.exports = handlers;
