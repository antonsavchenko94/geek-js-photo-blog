var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    host: "mailtrap.io",
    port: 2525,
    auth: {
        user: "95e1c78631e49c",
        pass: "b3f7dd7b24cde1"
    }
}));

var Option = {
    registerMail: function (email, token) {
        var options =
        {
            from: "Sender Name <de45458725-cacd67@inbox.mailtrap.io>",
            to: "Receiver Name <" + email + ">",
            subject: "Confirm email",
            html: "To continue registering on the blog you will need to click the link <a href='http://localhost:3000/register?token="+ token +"'>http://localhost:3000/register?token=" + token + "</a>"
        };
        return options;
    },
    recoveryPasswordMail: function (user, token) {
        var options =
        {
            from: "Sender Name <de45458725-cacd67@inbox.mailtrap.io>",
            to: user.first_name + " " + user.last_name + "<" + user.email + ">",
            subject: "New password",
            html: "It`s your new password: " + user.password +
            "</br> To comfirm password click link <a href='http:/localhost:3000/api/auth/active/"+token+"'>http:/localhost:3000/api/auth/active/" + token + "</a>"
        };
        return options;
    }
};

var SendMail = {
    sendRegistration: function (email, token, done) {
        var options = Option.registerMail(email, token);
        transporter.sendMail(options, function (error, response) {
            if (error)
                done(response, error);
            else
                done(response);
            transporter.close();
        });
    },
    sendRecoveryPassword: function (user, token, done) {
        var options = Option.recoveryPasswordMail(user, token);
        transporter.sendMail(options, function (error, response) {
            done(error);
            transporter.close();
        });
    }
};

module.exports = SendMail;