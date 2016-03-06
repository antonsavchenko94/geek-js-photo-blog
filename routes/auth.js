var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

router.post('/register', function(req, res, next) {
    bcrypt.hash(req.body.password, 10, function(error, hash) {
        req.body.password = hash;

        User.create(req.body, function(err, user) {
            if (err) {
                if (err.code === 11000) {
                    res.status(400).send({message: 'This username is already in use.'});
                } else {
                    res.status(400).send({message: err.message});
                }
            }
            res.send({
                _id: user._id,
                username: user.username
            });
            //res.end();
        });
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({
            username: username
        }, '+password', function(err, user) {
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

passport.serializeUser(function(user, done) {
    done(null, user && user._id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, '+password', function(err, user) {
        if (err) {
            return done(err);
        }

        return done(null, user);
    })
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).send({message: info.message});
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }

            res.send({user: deletePassword(req.user)});
        })
    })(req, res, next)
});

router.get('/logout', function(req, res) {
    req.logOut();
    res.end();
});

router.get('/islogged', function(req, res) {
    res.send(req.user ? {user: deletePassword(req.user)} : null);
});

//delete password before sending user data to client
function deletePassword(user) {
    var User = JSON.parse(JSON.stringify(user));
    delete User.password;
    return User;
}

module.exports = router;
