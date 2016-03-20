var express = require('express');
var multer = require('multer');
var fs = require('fs');

var Album = require('../models/album');
var albumController = require('../controllers/albumController')();
var albumService = require('../services/albumService')();
var uploadParams = albumService.uploadParams();

var router = express.Router();

var uploadPhotos = multer({storage: multer.diskStorage(uploadParams.photos)});
var uploadAvatar = multer({storage: multer.diskStorage(uploadParams.avatar)});

router.route('/getAllProfileAlbums')
    .get(albumController.getAllProfileAlbums);

router.route('/getAll/:username')
    .get(albumController.getAllByUsername);

router.route('/:id')
    .get(albumController.getById);

router.route('/:album_id/:photo_id')
    .get(albumController.getPhotoById);

router.route('/createNew')
    .post(albumController.createNewAlbum);

router.route('/remove')
    .post(albumController.removeAlbum);

router.route('/uploadPhotos')
    .post(uploadPhotos.single('file'), albumController.uploadPhotos);

router.route('/uploadAvatar')
    .post(uploadAvatar.single('file'), albumController.uploadAvatar);

module.exports = router;