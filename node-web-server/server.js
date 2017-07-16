const express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    //res.send('Hello Express!');
    res.send({
        name: 'Bohdan',
        likes: ['Nuts', 'Apples']
    })
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.get('/bad', () => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(3000);