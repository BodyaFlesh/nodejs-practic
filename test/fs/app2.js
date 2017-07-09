const fs = require('fs');
const zlib = require('zlib');

let readable = fs.createReadStream(__dirname + '/greet.txt');
let writable = fs.createWriteStream(__dirname + '/greetcopy.txt');
let compressed = fs.createWriteStream(__dirname + '/greet.txt.gz');
const gzip = zlib.createGzip();

readable.pipe(writable);
readable.pipe(gzip).pipe(compressed);