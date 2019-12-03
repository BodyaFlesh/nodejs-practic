/**
 * create and export configuration variables
 */

// container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging",
    hashingSecret: "thisIsASecret",
    maxChecks: 5,
    twilio: {
        accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
        authToken: "9455e3eb3109edc12e3d8c92768f7a67",
        fromPhone: "+15005550006"
    },
    templateGlobals: {
        appName: "UptimeChecker",
        companyName: "NotARealCompany, Inc.",
        yearCreated: "2018",
        baseUrl: "http://localhost:3000/"
    }
};

// production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
    hashingSecret: "thisIsASecret",
    maxChecks: 5,
    twilio: {
        accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
        authToken: "9455e3eb3109edc12e3d8c92768f7a67",
        fromPhone: "+15005550006"
    },
    templateGlobals: {
        appName: "UptimeChecker",
        companyName: "NotARealCompany, Inc.",
        yearCreated: "2018",
        baseUrl: "http://localhost:3000/"
    }
};

// detwermine which environment was passed as a commant-line arg
var currentEnvironment = typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV.toLowerCase() : "";

// check that the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof environments[currentEnvironment] == "object" ? environments[currentEnvironment] : environments.staging;

// export the module

module.exports = environmentToExport;
