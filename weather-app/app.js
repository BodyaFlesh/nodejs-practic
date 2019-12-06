const request = require("request");

const url = "https://api.darksky.net/forecast/5b0750f26aad2d2de1e90a6d5615c6a0/37.8267,-122.4233";

request({ url: url }, (error, response) => {
    const data = JSON.parse(response.body);
    console.log(data.currently);
});
