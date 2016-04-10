var express = require('express');
var multer = require('multer');
var fs = require('fs');

var photoController = require('../controllers/photo.controller')();
var likesController = require('../controllers/likes.controller')();

var albumService = require('../services/albumService')();
var uploadParams = albumService.uploadParams();

var router = express.Router();

var uploadPhotos = multer({storage: multer.diskStorage(uploadParams.photos)});
var uploadAvatar = multer({storage: multer.diskStorage(uploadParams.avatar)});

router.route('/complain/:album_id/:photo_id')
    .get(photoController.complainPhoto);

router.route('/likes/:photo_id')
    .get(likesController.getLikes)
    .put(likesController.togglePhotoLikes);

router.route('/:username/:album_id/:photo_id')
    .get(photoController.getPhotoById)
    .delete(photoController.deletePhoto);

router.route('/privacy')
    .put(photoController.updatePhotoPrivacy);

router.route('/')
    .post(uploadPhotos.single('file'), photoController.uploadPhotos);

router.route('/avatar')
    .post(uploadAvatar.single('file'), photoController.uploadAvatar);

module.exports = router;