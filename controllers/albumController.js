var Album = require('../models/album');
var User = require('../models/user');
var path = require('path');

var albumService = require('../services/albumService')();

var albumController = function () {

    var middleware = function (req, res, next) {
        next();
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

        var id = req.params.id;

        Album.findById(id)
            .populate('postedBy')
            .exec(function (err, album) {
                res.send({album: album});
            });
    };

    var getPhotoById = function (req, res) {
        var albumId = req.params.album_id;
        var photoId = req.params.photo_id;
        var user = req.user;

        Album
            .findOneAndUpdate(
                {
                    '_id': "" + albumId,
                    'postedBy': {$ne: user._id + ''},
                    'photos._id': "" + photoId
                },
                {$inc: {'photos.$.view_count': 1}},
                {new: true},
                function (err, data) {
                    Album.findOne(
                        {_id: albumId},
                        {'photos': {$elemMatch: {_id: photoId}}},
                        function (err, data) {
                            res.send({photo: data.photos[0]});
                        }
                    )
                });

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
        Album.find({isProfileAlbum: true})
            .populate('postedBy')
            .exec(function (err, albums) {
                if (err) {
                    console.log(err);
                    next(err);
                }
                res.send({albums: albums});
            });
    };

    var uploadPhotos = function (req, res, next) {
        var file = req.file;
        var fields = req.body;
        var photo = {
            filename: file.filename,
            uploaded: new Date(),
            status: fields.status || 'public',
            view_count: 0,
            pic: 'pic'
        };

        Album.findOne({_id: fields.albumId}, function (err, album) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log('==============title: ' + album.title);
            album.photos.push(photo);
            album.save();
        });

        res.json(file);
        res.end();
    };

    var removeAlbum = function (req, res, next) {
        var id = req.body.id;
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

    var uploadAvatar = function (req, res, next) {
        User.findOne({_id: req.user._id}, function (err, user) {
            var url = req.file.path;
            user.avatar = path.sep + url.substring(url.indexOf(path.sep) + 1);
            user.save();
        });

        res.end();
    };

    var updatePhoto = function (req, res, next) {
        var photo = req.body.photo;

        Album.update(
            {
                '_id': "" + photo.albumId,
                'photos._id': "" + photo._id
            },
            {$set: {'photos.$.status': photo.status}},
            function () {
                Album.findOne(
                    {_id: photo.albumId},
                    {'photos': {$elemMatch: {_id: photo._id}}},
                    function (err, data) {
                        res.send({photo: data.photos[0]});
                    }
                )
            });

    };

    return {
        getAllByUsername: getAllByUsername,
        getById: getById,
        getPhotoById: getPhotoById,
        createNewAlbum: createNewAlbum,
        getAllProfileAlbums: getAllProfileAlbums,
        middleware: middleware,
        uploadPhotos: uploadPhotos,
        uploadAvatar: uploadAvatar,
        removeAlbum: removeAlbum,
        editAlbum: editAlbum,
        updatePhoto: updatePhoto
    };
};

module.exports = albumController;