var express = require('express');
var router = express.Router();
var Album = require('../models/album');

router.get('/', function(req, res, next) {

    Album.find({}, function(err, albums) {
        if (err) {
            console.log(err);
            next(err);
        }
        res.send({albums: albums});
    });
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;

    Album.findOne({_id: id}, function(err, album) {
        if (err) {
            console.log(err);
            next(err);
        }
        res.send({album: album});
    });
});

router.post('/', function(req, res, next) {
    var newAlbum = req.body;
    newAlbum.created = new Date();

    Album.create(newAlbum, function (err, album) {
        if(err) {
            return next(err)
        }
        res.send(album);
    });
});

module.exports = router;