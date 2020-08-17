const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!'), 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    //check token exist
    if (!token) {
        return next(new AppError('Your are not logged in! Please log in to get access.', 401));
    }

    //decode token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //get fresh user
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }

    //check if user changed password after the token was issued
    if (currentUser.changesPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again', 401))
    }

    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    }
}

exports.forgotPassword = (req, res, next) => {
    //check user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });


    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? 
    Submit a Putch request with new password and passwordConfirm to: ${resetURL}.\n 
    If you didn't forget your password, please ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 100 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token send to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
}

exports.resetPassword = (req, res, next) => {

}