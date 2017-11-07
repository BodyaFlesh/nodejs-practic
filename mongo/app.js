const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
if(process.env.NODE_ENV !== 'test'){
    mongoose.connect('mongodb://localhost/muber');
}
mongoose.connection
    .once('open', () => { })
    .on('error', (error) => {
        console.warn('Warning', error);
    });

app.use(bodyParser.json());
routes(app);

app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message })
    next();
});

module.exports = app;