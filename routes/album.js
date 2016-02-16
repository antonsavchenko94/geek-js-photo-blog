var express = require('express');
var router = express.Router();
var Album = require('../models/album');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    Album.create(req.body, function (err, album) {
        if(err) {
            return next(err)
        }
        res.send(album);
    });
});

module.exports = router;