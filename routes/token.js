var express = require('express');
var router = express.Router();
var token = require('../controllers/token.controller.js');
var mail = require('../controllers/email.controller.js');
var User = require('../models/user');


router.post('/new', function (req, res, next) {
    User.findOne({'email': req.body.email}, function(err, user){
        if (user) {
            res.status(409).send({message: 'User with this email already exists'});
        } else {
            var tn = token.create(req.body);
            if (!tn) {
                res.status(500).send({message: 'Token was not created'});
            } else {
                mail.sendRegistration(req.body.email, tn, function (result, err) {
                    if (result)
                        res.status(200).send({message: "Registration mail was sent to your email address"});
                    else
                        res.status(500).send({message: "Email with token wasn't sent"});
                })

            }
        }
    });
});

router.post('/check/:token', function (req, res, next) {
    var tn = req.params.token;
    token.check(tn, function (email, err) {
        if (err) {
            res.status(500).send(err);
        }
        else
            res.status(200).send(email);
    })
});

module.exports = router;




