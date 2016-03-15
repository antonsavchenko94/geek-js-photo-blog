var User = require('../models/user.js');
var sendEmail = require('./email.controller.js');
var jwt = require('jsonwebtoken');
var Token = require('../models/token.js');

var secrete = 'photoblog';

var token = {
    create: function (email){
        var token = jwt.sign({'email':email}, secrete, {
            expiresIn: "10h"  // expires in 10 hours
        });
        Token.create({'value':token}, function(err, token) {
            if (err){
                throw err;
            }
        });
        return token;
    },
    check: function (token, done) {
        Token.findOne({'value':token}, function(err, tn){
            if(err){
                done(null, err);
            }
            if(tn){
                jwt.verify(tn.value, secrete, function(err, decoded) {
                    if (err) {
                        done(null, err);
                    } else {
                        Token.findByIdAndRemove(tn._id, function (err, offer) {
                            if (err) done(null, err);
                        });
                        done(decoded);
                    }
                });
            }else {
                done(null, 'token not found');
            }
        })
    }
};

module.exports = token;