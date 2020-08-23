const https = require('https');

const start = Date.now();

function doRequest(){
    https.request('https://www.google.com', res => {
        res.on('data', (data) => {
            console.log(data.toString());
        });
        res.on('end', () => {
            console.log(Date.now() - start);
        })
    }).end();
}

doRequest();
doRequest();
doRequest();
doRequest();
doRequest();