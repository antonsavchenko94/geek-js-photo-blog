var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    host: "mailtrap.io",
    port: 2525,
    auth: {
        user: "b87ab2cb2c8180",
        pass: "663cfe075bbc5f"
    }
}));

function setOption(email, token){
    var options =
    {
        from: "Sender Name <de45458725-cacd67@inbox.mailtrap.io>",
        to: "Receiver Name <"+ email +">",
        subject: "Confirm email",
        text: "To continue registering on the blog you will need to click the link http://localhost:3000/register?token="+ token
    };
    return options;
}

var sendMail = function(email, token, done) {
    var options = setOption(email, token);
    transporter.sendMail(options, function(error, response){
        done(error);
        transporter.close();
    });
};

module.exports = sendMail;