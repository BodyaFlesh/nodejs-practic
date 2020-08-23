const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest(){
    https.request('https://www.google.com', res => {
        res.on('data', (data) => {
            //console.log(data.toString());
        });
        res.on('end', () => {
            console.log(Date.now() - start);
        })
    }).end();
}

function doHash(){
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('Hash:', Date.now() - start);
    });
}

doRequest();

fs.readFile('text.txt', 'utf8', (err, data) => {
    //console.log(data);
    console.log('FS:', Date.now() - start);
})

doHash();
doHash();
doHash();
doHash();