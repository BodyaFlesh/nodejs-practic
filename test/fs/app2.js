const fs = require('fs');

let readable = fs.createReadStream(__dirname + '/greet.txt', {encoding : 'utf8', highWaterMark: 1024});

let writable = fs.createWriteStream(__dirname + '/greetcopy.txt');

readable.pipe(writable);