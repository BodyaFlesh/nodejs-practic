var fs = require('fs');

/*
var greet = fs.readFileSync(__dirname + '/greet.txt', 'utf8');
console.log(greet);

var greet2 = fs.readFile(__dirname + '/greet.txt', 'utf8',function(err, data){
    console.log(data);
});

console.log('log');
*/

var readable = fs.createReadStream(__dirname + '/greet.txt', {encoding : 'utf8', highWaterMark: 1024});

var writable = fs.createWriteStream(__dirname + '/greetcopy.txt');

readable.on('data', function(chunk){
    console.log(chunk);
    writable.write(chunk);
});