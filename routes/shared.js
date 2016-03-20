var express = require('express');
var albumController = require('../controllers/albumController')();

var router = express.Router();

router.route('/getAllProfileAlbums')
    .get(albumController.getAllProfileAlbums);
router.route('/createProfileAlbum')
    .post(albumController.createNewAlbum);

module.exports = router;