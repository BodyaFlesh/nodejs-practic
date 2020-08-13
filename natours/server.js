const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
    console.log('uncaught Exception! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((con) => {
    console.log('DB connection successful!');
})
.catch(error => {
    console.log(error);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    //console.log(`App running on port ${port}`);
});


process.on('unhandledRejection', err => {
    console.log('Unhandler rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});