const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const messsage = `Invalid ${err.path}: ${err.value}.`
    return new AppError(messsage, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        messag: err.message,
        error: err,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            messag: err.message
        });
    }
    // Programming or other unknown errorL don't leak error defails
    else {
        console.error('Error', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }


};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV == 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV == 'production') {
        let error = { ...err };
        if (error.name === "CastError") error = handleCastErrorDB(error);
        sendErrorProd(error, ress);
    }
}