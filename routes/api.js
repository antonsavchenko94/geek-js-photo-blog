var express = require('express');
var router = express.Router();

var auth = require('./auth');
var users = require('./users');
var album = require('./album');
var admin = require('./admin');

router.use('/auth', auth);

//require user
router.use(function(req, res, next) {
    if (!req.isAuthenticated()){
       return res.status(401).redirect('/login');
    }
    next();
});
router.use('/users', users);
router.use('/album', album);

//require admin
router.use(function(req, res, next) {
    if (!(req.isAuthenticated() && req.user.isAdmin)){
        return res.status(401).redirect('/login');
    }
    next();
});
router.use('/admin', admin);

module.exports = router;