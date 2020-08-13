const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

console.log(process.env.DATABASE);

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
    console.log(err.name, err.message);
    console.log('Unhandler rejection! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});