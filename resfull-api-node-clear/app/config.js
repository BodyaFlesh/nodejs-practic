/**
 * create and export configuration variables
 */

// container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
    port: 3000,
    envName: "staging"
};

// production environment
environments.production = {
    port: 5000,
    envName: "production"
};

// detwermine which environment was passed as a commant-line arg
var currentEnvironment =
    typeof process.env.NODE_ENV == "string"
        ? process.env.NODE_ENV.toLowerCase()
        : "";

// check that the current environment is one of the environments above, if not, default to staging
var environmentToExport =
    typeof environments[currentEnvironment] == "object"
        ? environments[currentEnvironment]
        : environments.staging;

// export the module

module.exports = environmentToExport;
