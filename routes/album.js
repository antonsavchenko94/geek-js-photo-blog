var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var Album = require('../models/album');
var albumService = require('../services/albumService');
var albumController = require('../controllers/albumController')(albumService);

var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, getAlbumPath({
            postedBy: req.body.user,
            _id: req.body.albumId
        }))
    },
    filename: function (req, file, cb) {

        var splitedFilename = file.originalname.split('.');
        var extension = "." + splitedFilename[splitedFilename.length - 1];
        cb(null, req.body.user._id + '_' + Date.now() + extension);
    }
});

var upload = multer({storage: storage});

function mkdir(path) {

    try {
        fs.mkdirSync(path);

    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

function mkdirPath(dirPath) {
    var pathParts = dirPath.split(path.sep);

    for (var i = 1; i <= pathParts.length; i++) {
        mkdir(path.join.apply(null, pathParts.slice(0, i)));
    }
}

function getAlbumPath(album) {
    var s = path.sep;
    return path.normalize(
        '..' + s
        + 'public' + s
        + 'assets' + s
        + album.postedBy.username + s
        + album._id
    );
}

function createAlbumDirectory(album) {
    mkdirPath(getAlbumPath(album));
}

router.route('/getAll/:username')
    .get(albumController.getAllByUsername);


router.route('/:id')
    .get(albumController.getById);

router.route('/createNew')
    .post(albumController.createNewAlbum);

router.post('/uploadPhotos', upload.single('file'), function (req, res, next) {
    var file = req.file;
    var fields = req.body;
    var photo = {
        filename: file.filename,
        uploaded: new Date(),
        status: fields.status || 'public',
        view_count: 0,
        pic: 'pic'
    };

    Album.findOne({_id: fields.albumId}, function (err, album) {
        if (err) {
            console.log(err);
            next(err);
        }
        console.log('==============title: ' + album.title);
        album.photos.push(photo);
        album.save();
    });

    res.json(file);
    res.end();
});


module.exports = router;