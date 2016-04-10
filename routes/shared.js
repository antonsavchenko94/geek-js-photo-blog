var express = require('express');
var albumController = require('../controllers/albumController')();

var router = express.Router();

router.route('/profileAlbum')
    .get(albumController.getAllProfileAlbums)
    .post(albumController.createNewAlbum);

module.exports = router;