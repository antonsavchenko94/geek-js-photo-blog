var User = require('../models/user.js');
var sendEmail = require('./email.controller.js');
var jwt = require('jsonwebtoken');


var token = {
    create: function (email, done){
        User.findOne({'email': email}, function (err, user) {
            console.log(email);
            if (!user){
                var token = jwt.sign({'email':email}, 'photoblog', {
                    expiresInSecond: 720 // expires in 12 hours
                });
                sendEmail(email, token, function(error){
                    done(error);
                });
            }
        });
    },
    check: function (token, done) {
        jwt.verify(token, 'photoblog', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                done(decoded);
            }
        });
    }
};

module.exports = token;