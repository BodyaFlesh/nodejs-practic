/**
 * Helpers for various tasks
 */

// dependencies
const crypto = require("crypto");
const config = require("../config");

// Container for all the helpers
var helpers = {};

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

//export the module
module.export = helpers;
