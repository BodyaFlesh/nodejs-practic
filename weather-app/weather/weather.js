const request = require('request');


//22095738344fda62bf5278b9948be527

var getWeather = (lat, lng, callback) => {

    request({
        url : `https://api.darksky.net/forecast/22095738344fda62bf5278b9948be527/${lat},${lng}`,
        json : true
    }, (error, response, body) => {
        if(!error && response.statusCode === 200){
            callback(undefined, {
                temperature : body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        }else{
            console.log('Unable to fetch weather');
        }
    });  

};

module.exports.getWeather = getWeather;