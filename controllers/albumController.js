var Album = require('../models/album');
var User = require('../models/user');

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
        Album.update(
            {
                '_id': ""+albumId,
                'photos._id': ""+photoId
            },
            {$inc: {'photos.$.view_count': 1}},
            function () {
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

    var removeAlbum = function (req, res, next){
        var id = req.body.id;

        Album.remove({_id: id}, function (err) {
            if (err) {
                console.log(err);
                next(err);
            }
            res.status = 200;
            res.end();
        });

    };

    var uploadAvatar = function(req, res, next) {
        User.findOne({_id: req.user._id}, function(err, user) {
            var url = req.file.path;
            user.avatar = '/' + url.substring(url.indexOf('/') + 1);
            user.save();
        });

        res.end();
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
        removeAlbum: removeAlbum
    };
};

module.exports = albumController;