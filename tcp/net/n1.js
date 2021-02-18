const net = require('net');

net.createServer(socket => {
    socket.write('start!!!');
    console.dir(socket.address());
    socket.on('data', data => {
        console.log('data', data);
    })
}).listen(2000);