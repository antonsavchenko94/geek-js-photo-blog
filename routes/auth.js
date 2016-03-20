var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var sendEmail = require('../controllers/email.controller.js');
var token = require('../controllers/token.controller.js');

router.post('/register', function (req, res, next) {
    bcrypt.hash(req.body.password, 10, function (error, hash) {
        req.body.password = hash;

        User.create(req.body, function (err, user) {
            if (err) {
                if (err.code === 11000) {
                    res.status(400).send({message: 'This username is already in use.'});
                } else {
                    res.status(400).send({message: err.message});
                }
            }

            res.end();
        });
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({
            username: username
        }, '+password', function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, null, {message: 'Incorrect username.'});
            }

            bcrypt.compare(password, user.password, function (error, isValid) {
                if (error) {
                    return error;
                }

                if (!isValid) {
                    return done(null, null, {message: 'Incorrect password.'})
                }

                return done(null, user)
            })
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user && user._id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, '+password', function (err, user) {
        if (err) {
            return done(err);
        }

        return done(null, user);
    })
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).send({message: info.message});
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }

            res.send({user: deletePassword(req.user)});
        })
    })(req, res, next)
});

router.get('/logout', function (req, res) {
    req.logOut();
    res.end();
});

router.get('/islogged', function (req, res) {
    res.send(req.user ? {user: deletePassword(req.user)} : null);
});

router.post('/recovery', function (req, res, next) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).send({message: "user isn't found"});
        }
        var newPassword = passwordGenerator();
        user.save(function (err) {
            if (err) {
                return res.status(400).send({message: "Can't save user"});
            } else {
                var tn = token.create({"email": user.email, "password": newPassword});
                user.password = newPassword;
                sendEmail.sendRecoveryPassword(user, tn, function (err) {
                    if (err) {
                        return next(err);
                    } else {
                        res.status(200).send();
                    }
                });
            }
        })
    })
});

router.get('/active/:token', function (req, res) {
    token.check(req.params.token, function (result, err) {
        if (err) {
            res.status(400).send({message: err});
        } else {
            User.findOne({'email': result.email}, function (err, user) {
                bcrypt.hash(result.password, 10, function (error, hash) {
                    user.password = hash;
                    user.save(function (err) {
                        if (err) {
                            res.status(400).send({message: "Can't save user"});
                        } else {
                            res.status(200).redirect('/login');
                        }
                    })
                });
            })
        }
    })
});

//delete password before sending user data to client
function deletePassword(user) {
    var User = JSON.parse(JSON.stringify(user));
    delete User.password;
    return User;
}

function passwordGenerator() {
    var password = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++) {
        password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return password;
}

module.exports = router;
