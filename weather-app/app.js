const request = require("request");

const url = "https://api.darksky.net/forecast/5b0750f26aad2d2de1e90a6d5615c6a0/37.8267,-122.4233?units=si&lang=uk";

request({ url: url, json: true }, (error, response) => {
    console.log(
        `${response.body.daily.data[0].summary} It is currently ${response.body.currently.temperature} defress out. There is a ${response.body.currently.precipProbability}% change of rain.`
    );
    //console.log(response.body.currently);
});

const geocodeURL =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1IjoiYm9keWFmbGVzaCIsImEiOiJjazN1c2FldWMwZm05M29vM3gwN204aGlqIn0.o8FWSCiUrEgmq8ShpfPUbA&limit=1";

request({ url: geocodeURL, json: true }, (error, response) => {
    const latitude = response.body.features[0].center[1];
    const longitude = response.body.features[0].center[0];
    console.log({ latitude, longitude });
});

//Geocoding
