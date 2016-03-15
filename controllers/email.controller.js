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

var Option = {
    registerMail: function(email, token){
        var options =
        {
            from: "Sender Name <de45458725-cacd67@inbox.mailtrap.io>",
            to: "Receiver Name <"+ email +">",
            subject: "Confirm email",
            text: "To continue registering on the blog you will need to click the link http://localhost:3000/register?token="+ token
        };
        return options;
    },
    recoveryPasswordMail: function(user, token){
        var options =
        {
            from: "Sender Name <de45458725-cacd67@inbox.mailtrap.io>",
            to: user.first_name+" "+ user.last_name + "<"+ user.email +">",
            subject: "New password",
            html: "It`s your new password: "+ user.password +
                "</br> To comfirm password click link <a>http:/localhost:3000/api/auth/active/"+token+"</a>"
        };
        return options;
    }
};

var SendMail = {
    sendRegistration: function(email, token, done) {
        var options = Option.registerMail(email, token);
        transporter.sendMail(options, function(error, response){
            done(error);
            transporter.close();
        });
    },
    sendRecoveryPassword: function(user, token, done) {
        var options = Option.recoveryPasswordMail(user, token);
        transporter.sendMail(options, function(error, response){
            done(error);
            transporter.close();
        });
    }
};

module.exports = SendMail;