var express = require('express');

var albumController = require('../controllers/albumController')();

var router = express.Router();

router.route('/profileAlbum/:username')
    .get(albumController.getProfileAlbum);

router.route('/:username')
    .get(albumController.getAllByUsername);

router.route('/:username/:id')
    .get(albumController.getById)
    .delete(albumController.removeAlbum);

router.route('/')
    .post(albumController.createNewAlbum)
    .put(albumController.editAlbum);

module.exports = router;