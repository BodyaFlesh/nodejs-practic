const nodemailer = require('nodemailer');
const nodemailerStup = require('nodemailer-stub');

const transporter = nodemailer.createTransport(nodemailerStup.stubTransport);

module.exports = transporter;
