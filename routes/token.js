var express = require('express');
var router = express.Router();
var token = require('../controllers/token.controller.js');


router.post('/:email', function (req, res, next) {
    token.create({"email": req.params.email}, function (err) {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200);
        }
    });
});

router.post('/check/:token', function (req, res, next) {
    var tn = req.params.token;
    token.check(tn, function (email) {
        res.send(JSON.stringify({'email': email}));
    })
});

module.exports = router;




