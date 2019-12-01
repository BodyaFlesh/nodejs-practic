/**
 * Helpers for various tasks
 */

// dependencies
const crypto = require("crypto");
const config = require("./config");
const https = require("https");
const querystring = require("querystring");

// Container for all the helpers
var helpers = {};

// create a SHA256 hash
helpers.hash = function(str) {
    if (typeof str == "string" && str.length > 0) {
        let hash = crypto
            .createHmac("sha256", config.hashingSecret)
            .update(str)
            .digest("hex");
        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

// create a string of reandom alphanumeric charactes, of a fiven length
helpers.createRandomString = function(strLength) {
    strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

        // Start the final string
        var str = "";
        for (i = 1; i <= strLength; i++) {
            // Get a random charactert from the possibleCharacters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the string
            str += randomCharacter;
        }
        // Return the final string
        return str;
    } else {
        return false;
    }
};

//Send an SMS message via Twilio
helpers.sendTwilioSms = function(phone, msg, callback) {
    // validate parameters
    phone = typeof phone == "string" && phone.trim().length == 10 ? phone.trim() : false;
    msg = typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if (phone && msg) {
        // Configure the request payload
        var payload = {
            From: config.twilio.fromPhone,
            To: "+1" + phone,
            Body: msg
        };

        // stringify the payload
        let stringPayload = querystring.stringify(payload);

        // configure the request details
        let requestDetails = {
            protocol: "https:",
            hostname: "api.twilio.com",
            method: "POST",
            path: "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
            auth: config.twilio.accountSid + ":" + config.twilio.authToken,
            headers: {
                "Content-type": "application/x-www-urlencoded",
                "Content-length": Buffer.byteLength(stringPayload)
            }
        };

        // Instatiation the request object
        let req = https.request(requestDetails, function(res) {
            // Grab the status of the sent request
            let status = res.statusCode;
            // callback successfully if the request went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback("Status code returned was " + status);
            }
        });

        // Bind to the error event so it doesn't get thrown
        req.on("error", function(e) {
            callback(e);
        });

        // And the payload
        req.write(stringPayload);

        // End the request
        req.end();
    } else {
        callback("Given parameters were missing or invalid");
    }
};

//export the module
module.exports = helpers;
