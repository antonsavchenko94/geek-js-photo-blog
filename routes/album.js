var express = require('express');

var albumController = require('../controllers/albumController')();

var albumService = require('../services/albumService')();

var router = express.Router();

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

router.route('/createNew')
    .post(albumController.createNewAlbum);

router.route('/remove/:id')
    .delete(albumController.removeAlbum);

router.route('/edit')
    .put(albumController.editAlbum);

module.exports = router;