var Album = require('../models/album');
var User = require('../models/user');
var Likes = require('../models/likes');
var path = require('path');
var ObjectId = require('mongoose').Types.ObjectId;

var albumService = require('../services/albumService')();
var amountOfPhotosPerRequest = 12;

var albumController = function () {
    var seenPhotosCount = 0;

    var middleware = function (req, res, next) {
        next();
    };

    var getPhotoArrayByParam = function (req, param, cb) {
        if (!req.query.loadMore) {
            seenPhotosCount = 0;
        }

        Album.aggregate([
            {$unwind: '$photos'},
            {$match: param},
            {
                $project: {
                    album_id: '$_id',
                    _id: '$photos._id',
                    filename: '$photos.filename',
                    uploaded: '$photos.uploaded',
                    view_count: '$photos.view_count',
                    status: '$photos.status',
                    postedBy: '$postedBy'
                }
            },
            {$sort: {uploaded: -1}},
            {$skip: seenPhotosCount},
            {$limit: amountOfPhotosPerRequest}
        ], function (err, result) {
            if (err) {
                return cb(err);
            }

            Album.populate(result, 'postedBy', function (err, photos) {
                if (err) {
                    return cb(err);
                }

                seenPhotosCount += photos.length;

                return cb(null, photos);
            })
        })
    };

    var getAllByUsername = function (req, res) {
        var username = req.params.username;
        User.findOne({username: username}, function (err, user) {
            Album.find({postedBy: user._id})
                .sort('created')
                .exec(function (err, albums) {
                        if (err) {
                            console.log(err);
                            next(err);
                        }

                        res.send({albums: albums});
                    }
                );
        });

    };

    var getById = function (req, res) {
        var params = {_id: ObjectId(req.params.id)};

        if (req.params.username != req.user.username) {
            params['photos.status'] = {$ne: 'private'}
        }

        getPhotoArrayByParam(req, params, function (err, photos) {
            res.send({album: photos, noMoreData: (photos.length < amountOfPhotosPerRequest)})
        })
    };

    var createNewAlbum = function (req, res, next) {
        var isProfileAlbum = !!req.body.isProfileAlbum || false;

        var album = {
            title: isProfileAlbum ? 'Profile album' : req.body.title,
            postedBy: req.body.postedBy,
            created: new Date(),
            isProfileAlbum: isProfileAlbum
        };

        Album.findOne({postedBy: album.postedBy._id, title: album.title}, function (err, queryAlbum) {

            if (queryAlbum) {
                res.send(queryAlbum.title + " album already exists");
            } else {
                Album.create(album, function (err, a) {
                    if (err) {
                        console.log(err);
                        return next(err)
                    }
                    Album.findOne({title: a.title, postedBy: album.postedBy._id}, function (err, receivedAlbum) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }
                        album._id = receivedAlbum._id;

                        res.send(album);
                        albumService.createAlbumDirectory(album);
                    });
                });
            }
        });
    };

    var getAllProfileAlbums = function (req, res, next) {
        getPhotoArrayByParam(req, {
            $and: [
                {isProfileAlbum: true},
                {'photos.status': {$ne: 'private'}}]
        }, function (err, photos) {
            res.send({album: photos, noMoreData: (photos.length < amountOfPhotosPerRequest)});
        })
    };

    var getProfileAlbum = function (req, res, next) {
        User.findOne({username: req.params.username}, function (err, user) {
            getPhotoArrayByParam(req, {
                    postedBy: user._id,
                    isProfileAlbum: true,
                    'photos.status': {$ne: 'private'}
                },
                function (err, photos) {
                    res.send({album: photos, noMoreData: (photos.length < amountOfPhotosPerRequest)});
                }
            )
        })
    };

    var removeAlbum = function (req, res, next) {
        var id = req.params.id;
        Album.findOne({_id: id})
            .populate('postedBy')
            .exec(function (error, album) {
                albumService.removeAlbum(album);
                album.remove(function (err) {
                    if (err) {
                        console.log(err);
                        next(err);
                    }
                    res.status(200).end();
                })
            });
    };

    var editAlbum = function (req, res, next) {
        var reqAlbum = req.body.album;

        Album.findById(reqAlbum.id, function (err, album) {
            if (err) {
                console.log(err);
                next(err);
            }
            album.title = reqAlbum.title;
            album.save(function (err) {
                if (err) {
                    console.log(err);
                    next(err);
                }
            });
            res.send(album);
        });
    };

    return {
        middleware: middleware,

        getAllByUsername: getAllByUsername,
        getById: getById,
        createNewAlbum: createNewAlbum,
        getAllProfileAlbums: getAllProfileAlbums,
        getProfileAlbum: getProfileAlbum,
        removeAlbum: removeAlbum,
        editAlbum: editAlbum
    };
};

module.exports = albumController;