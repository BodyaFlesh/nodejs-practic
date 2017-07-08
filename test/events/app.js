// object properties and methods
/*
var obj = {
    greet: 'Hello'
}

console.log(obj.greet);
console.log(obj['greet']);
var prop = 'greet';
console.log(obj[prop]);

// function and array

var arr = [];

arr.push(function(){
    console.log('Hello word 1');
});
arr.push(function(){
    console.log('Hello word 2');
});
arr.push(function(){
    console.log('Hello word 3');
});

arr.forEach(function(item){
    item();
});

*/

var Emitter = require('events');
var eventConfig = require('./config').events;

var emtr = new Emitter();

emtr.on(eventConfig.GREET, function(){
    console.log('Somewhre, someone said hello.');
});

emtr.on(eventConfig.GREET, function(){
    console.log('Somewhere, someone said hello');
});

emtr.on('greet', function(){
    console.log('A greeting occurred!');
});

console.log('Hello');

emtr.emit('greet');