const nodemailer = require('nodemailer');

const sendEmail = async options => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        post: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'test <test@test.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendEmail(mailOptions);
}

module.exports = sendEmail;