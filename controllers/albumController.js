var Album = require('../models/album');
var User = require('../models/user');
var path = require('path');
var fs = require('fs');

var albumController = function (albumService) {

    var middleware = function (req, res, next) {
        next();
    };

    var getAllByUsername = function (req, res) {
        var username = req.params.username;
        User.findOne({username: username}, function (err, user) {
            Album.find({postedBy: user._id}, function (err, albums) {
                if (err) {
                    console.log(err);
                    next(err);
                }
                res.send({albums: albums});
            });
        });

    };

    var getById = function (req, res) {

        var id = req.params.id;

        Album.findById(id)
            .populate('postedBy')
            .exec(function (err, album) {
                res.send({album: album});
            });
    };

    var createNewAlbum = function (req, res, next) {

        var isProfileAlbum = !!req.body.isProfileAlbum || false;

        var album = {
            title: req.body.title,
            postedBy: req.body.postedBy,
            created: new Date(),
            isProfileAlbum: isProfileAlbum
        };

        Album.findOne({title: album.title}, function (err, queryAlbum) {

            if (queryAlbum){
                res.send(queryAlbum.title + " album already exists");
            } else {
                Album.create(album, function (err, a) {
                    if (err) {
                        console.log(err);
                        return next(err)
                    }
                    Album.findOne({title: a.title}, function (err, receivedAlbum) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }
                        album._id = receivedAlbum._id;

                        res.send(album);
                        createAlbumDirectory(album);
                    });
                });
            }
        });
    };

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
        console.log('Is profile album: ' + album.isProfileAlbum);
        console.log(album);
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

    return {
        getAllByUsername: getAllByUsername,
        getById: getById,
        createNewAlbum: createNewAlbum,
        middleware: middleware
    };
};

module.exports = albumController;
