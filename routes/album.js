var express = require('express');
var multer = require('multer');
var fs = require('fs');

var albumController = require('../controllers/albumController')();
var likesController = require('../controllers/likes.controller')();

var albumService = require('../services/albumService')();
var uploadParams = albumService.uploadParams();

var router = express.Router();

var uploadPhotos = multer({storage: multer.diskStorage(uploadParams.photos)});
var uploadAvatar = multer({storage: multer.diskStorage(uploadParams.avatar)});

router.route('/getAllProfileAlbums')
    .get(albumController.getAllProfileAlbums);

router.route('/getProfileAlbum/:username')
    .get(albumController.getProfileAlbum);

router.route('/getAll/:username')
    .get(albumController.getAllByUsername);

router.route('/:id')
    .get(albumController.getById);

router.route('/getOwnById/:id')
    .get(albumController.getOwnById);

router.route('/:album_id/:photo_id')
    .get(albumController.getPhotoById);

router.route('/updatePhotoPrivacy')
    .post(albumController.updatePhotoPrivacy);

router.route('/togglePhotoLikes')
    .put(likesController.togglePhotoLikes);

router.route('/getLikes')
    .post(likesController.getLikes);

router.route('/createNew')
    .post(albumController.createNewAlbum);

router.route('/remove')
    .post(albumController.removeAlbum);

router.route('/edit')
    .post(albumController.editAlbum);

router.route('/uploadPhotos')
    .post(uploadPhotos.single('file'), albumController.uploadPhotos);

router.route('/uploadAvatar')
    .post(uploadAvatar.single('file'), albumController.uploadAvatar);

module.exports = router;