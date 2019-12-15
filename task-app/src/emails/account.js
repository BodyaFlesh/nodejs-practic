const sgMail = require("@sendgrid/mail");
const sendgridAPIKey = "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";

sgMail.setApiKey(sendgridAPIKey);

sgMail.send({
    to: "bodya.flesh@gmail.com",
    from: "bodya.flesh@gmail.com",
    subject: "This is my first creation!",
    text: "test text"
});
