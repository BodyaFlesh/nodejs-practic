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
    maxChecks: 5
};

// production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
    hashingSecret: "thisIsASecret",
    maxChecks: 5
};

// detwermine which environment was passed as a commant-line arg
var currentEnvironment = typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV.toLowerCase() : "";

// check that the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof environments[currentEnvironment] == "object" ? environments[currentEnvironment] : environments.staging;

// export the module

module.exports = environmentToExport;
