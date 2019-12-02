/**
 *  Worker-related tasks
 */

// Dependencies
const path = require("path");
const fs = require("fs");
const _data = require("./data");
const https = require("https");
const http = require("http");
const helpers = require("./helpers");
const url = require("url");
const _logs = require("./logs");

// Instantiate the worker object
var workers = {};

// Lookup all checks, get their data, send to a validator

workers.gatherAllChecks = function() {
    // Geet all the checks
    _data.list("checks", function(err, checks) {
        if (!err && checks && checks.length > 0) {
            checks.forEach(function(check) {
                // Read in the check data
                _data.read("checks", check, function(err, originalCheckData) {
                    if (!err && originalCheckData) {
                        // Pass it to the check validator, and let that function continue or log errors as needed
                        workers.validateCheckData(originalCheckData);
                    } else {
                        console.log("Error reading one of the check's data");
                    }
                });
            });
        } else {
            console.log("Error: Could not find any checks to process");
        }
    });
};

// Sanity-check the check-data
workers.validateCheckData = function(originalCheckData) {
    originalCheckData = typeof originalCheckData == "object" && originalCheckData !== null ? originalCheckData : {};
    originalCheckData.id = typeof originalCheckData.id == "string" && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone =
        typeof originalCheckData.userPhone == "string" && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol =
        typeof originalCheckData.protocol == "string" && ["http", "https"].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol.trim() : false;
    originalCheckData.url = typeof originalCheckData.url == "string" && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method =
        typeof originalCheckData.method == "string" && ["post", "get", "put", "delete"].indexOf(originalCheckData.method) > -1
            ? originalCheckData.method.trim()
            : false;
    originalCheckData.successCodes =
        typeof originalCheckData.successCodes == "object" && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0
            ? originalCheckData.successCodes
            : false;
    originalCheckData.timeoutSeconds =
        typeof originalCheckData.timeoutSeconds == "number" &&
        originalCheckData.timeoutSeconds % 1 === 0 &&
        originalCheckData.timeoutSeconds >= 1 &&
        originalCheckData.timeoutSeconds <= 5
            ? originalCheckData.timeoutSeconds
            : false;

    // Set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state =
        typeof originalCheckData.state == "string" && ["up", "down"].indexOf(originalCheckData.state) > -1 ? originalCheckData.state.trim() : "down";
    originalCheckData.lastChecked =
        typeof originalCheckData.lastChecked == "number" && originalCheckData.lastChecked > 0 ? originalCheckData.timeoutSeconds : false;

    // If all the checks pass, pass the data along to the next step in the process
    if (
        originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds
    ) {
        workers.performCheck(originalCheckData);
    } else {
        console.log("Error: One of the checks is not properly formatted. Skipping it.");
    }
};

// Perform the check, send the origenalCheckData and the outcome of the check process, to the next step in the process
workers.performCheck = function(origenalCheckData) {
    // prepare the initial check outcome
    let checkOutcome = {
        error: false,
        responseCode: false
    };

    //Mark that the outcome has not been sent yet
    let outcomeSent = false;

    // Parse the hostname and the path out of the original check data
    let parseUrl = url.parse(origenalCheckData.protocol + "://" + origenalCheckData.url, true);
    let hostName = parseUrl.hostname;
    let path = parseUrl.path; // Using path and  not "pathname" becouse we want the query string

    // Construc the request
    let requestDetails = {
        protocol: origenalCheckData.protocol + ":",
        hostname: hostName,
        method: origenalCheckData.method.toUpperCase(),
        path,
        timeout: origenalCheckData.timeoutSeconds * 1000
    };

    // Instantiate the request object (using either the http or https module)
    let _moduleToUse = origenalCheckData.protocol == "http" ? http : https;
    let req = _moduleToUse.request(requestDetails, function(res) {
        // Grab the status of the sent request
        let status = res.statusCode;

        // Update the checkOutcome and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.procesCheckOutcome(origenalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to the eeror event so it doesn't get thrown
    req.on("error", function(e) {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: e
        };

        if (!outcomeSent) {
            workers.procesCheckOutcome(origenalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to the timeout event
    req.on("timeout", function(e) {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {
            error: true,
            value: "timeout"
        };

        if (!outcomeSent) {
            workers.procesCheckOutcome(origenalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // End the request
    req.end();
};

// Process the check outcome, update the check data as needed, trigger an alert if needed
// Special logic for accomodating a check that has never been tested before (don't alert on that one)

workers.procesCheckOutcome = function(origenalCheckData, checkOutcome) {
    // Decide if the check is considered up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && origenalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? "up" : "down";

    // Decide if an alert is warranted
    let alertWarranted = origenalCheckData.lastChecked && origenalCheckData.state !== state ? true : false;

    // Log the outcome
    let timeOfCheck = Date.now();
    workers.log(origenalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

    // Update the check data
    let newCheckData = origenalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;

    // Save the update
    _data.update("checks", newCheckData.id, newCheckData, function(err) {
        if (!err) {
            // Send the new check data to the next phare in the process if needed
            if (alertWarranted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                console.log("Check outcome has not changed, no alert needed");
            }
        } else {
            console.log("Error trying to save updates to one of the checks");
        }
    });
};

// Alert the user as to a chnge in their check status
workers.alertUserToStatusChange = function(newCheckData) {
    let msg =
        "Alert: Your check for " +
        newCheckData.method.toUpperCase() +
        " " +
        newCheckData.protocol +
        "://" +
        newCheckData.url +
        "is currently" +
        newCheckData.state;
    helpers.sendTwilioSms(newCheckData.userPhone, msg, function(err) {
        if (!err) {
            console.log("Success: User was alerted to a status change in their check, vie sms:", msg);
        } else {
            console.log("Error: Could not send sms alert to user who hand as state change in their check");
        }
    });
};

workers.log = function(origenalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
    // Form the log data
    let logData = {
        check: origenalCheckData,
        outcome: checkOutcome,
        state,
        alert: alertWarranted,
        time: timeOfCheck
    };

    // Convert data to a string
    let logString = JSON.stringify(logData);

    // Determine the name of the log file
    let logFileName = origenalCheckData.id;

    // Append the log string to the file
    _logs.append(logFileName, logString, function(err) {
        if (!err) {
            console.log("Logging to file succeeded");
        } else {
            console.log("Loggin to file failed");
        }
    });
};

// Timer to execute the worker-process once per minute
workers.loop = function() {
    setInterval(function() {
        workers.gatherAllChecks();
    }, 1000 * 60);
};

// Rotate (compress) the log files
workers.rotateLogs = function() {
    // List all the (non compressed) log files
    _logs.list(false, function(err, logs) {
        if (!err && logs && logs.length > 0) {
            logs.forEach(function(logName) {
                // Compress the data to a different file
                let logId = logName.replace(".log", "");
                let newFileId = logId + "-" + Date.now();
                _logs.compress(logId, newFileId, function(err) {
                    if (!err) {
                        // Truncate the log
                        _logs.truncate(logId, function(err) {
                            if (!err) {
                                console.log("Success truncating logFile");
                            } else {
                                console.log("Error trancated logFile");
                            }
                        });
                    } else {
                        console.log("Error compressing one of the log files", err);
                    }
                });
            });
        } else {
            console.log("Error: could not find any logs to rotate");
        }
    });
};

// Timer to execute the log-rotation process once per day
workers.logRotationLoop = function() {
    setInterval(function() {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
};

// Init script
workers.init = function() {
    // Execute all the checks immediately
    workers.gatherAllChecks();

    // Call the loop so the checks will execute later on
    workers.loop();

    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so logs will be compressed later on
    workers.logRotationLoop();
};

// Export the module
module.exports = workers;
