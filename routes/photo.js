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

router.route('/:album_id/:photo_id')
    .get(photoController.getPhotoById);

router.route('/complain/:album_id/:photo_id')
    .get(photoController.complainPhoto);

router.route('/delete/:username/:album/:photo')
    .delete(photoController.deletePhoto);

router.route('/toggleLikes')
    .put(likesController.togglePhotoLikes);

router.route('/getLikes')
    .post(likesController.getLikes);

router.route('/updatePrivacy')
    .put(photoController.updatePhotoPrivacy);

router.route('/upload')
    .post(uploadPhotos.single('file'), photoController.uploadPhotos);

router.route('/uploadAvatar')
    .post(uploadAvatar.single('file'), photoController.uploadAvatar);

module.exports = router;