var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.post('/register', function(req, res, next) {
    console.log(req.body);
    User.create(req.body, function(err, user) {
        if (err) {
            console.log(err);
            return next(err)
        }

        res.send({success: true});
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({
            username: username,
            password: password
        }, '-password', function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, null, {message: 'incorrect username or password'});
            }

            return done(null, user)
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user && user._id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, '-password', function(err, user) {
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
            return res.send({message: info.message})
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }

            res.send({user: user});
        })
    })(req, res, next)
});

router.get('/logout', function(req, res) {
    req.logOut();
    res.end();
});

module.exports = router;
