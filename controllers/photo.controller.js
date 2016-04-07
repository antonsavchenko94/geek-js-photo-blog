var Album = require('../models/album');
var User = require('../models/user');

var path = require('path');

var photoController = function () {

    var middleware = function (req, res, next) {
        next();
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

                function (err, updatedAlbum) {

                    if (updatedAlbum){
                        User.findOneAndUpdate(
                            {_id: "" + updatedAlbum.postedBy},
                            {$inc: {global_views: 1}},
                            {new: true},
                            function (err, user){
                                if (err){
                                    console.log(err);
                                }
                            }
                        );
                    }

                    Album.findOne(
                        {_id: albumId},
                        {'photos': {$elemMatch: {_id: photoId}}},
                        function (err, data) {
                            res.send({photo: data.photos[0]});
                        }
                    )
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
            album.photos.push(photo);
            album.save();
        });

        res.json(file);
        res.end();
    };

    var uploadAvatar = function (req, res, next) {
        User.findOne({_id: req.user._id}, function (err, user) {
            var url = req.file.path;
            user.avatar = path.sep + url.substring(url.indexOf(path.sep) + 1);
            user.save();
        });
        res.status = 200;
        res.end();
    };

    var updatePhotoPrivacy = function (req, res, next) {
        var photo = req.body.photo;

        Album.update(
            {
                '_id': "" + photo.album_id,
                'photos._id': "" + photo._id
            },
            {$set: {'photos.$.status': photo.status}},
            function () {
                Album.findOne(
                    {_id: photo.album_id},
                    {'photos': {$elemMatch: {_id: photo._id}}},
                    function (err, data) {
                        res.send({photo: data.photos[0]});
                    }
                )
            });
    };

    var complainPhoto = function (req, res, next) {
        var albumId = req.params.album_id;
        var photoId = req.params.photo_id;
        Album.update(
            {
                '_id': "" + albumId,
                'photos._id': "" + photoId
            },
            {$inc: {'photos.$.complain': 1}},
            function () {
                res.status(200).send('Your complaint is accepted');
            });
    };

    var deletePhoto = function (req, res) {
        Album.update({_id: req.params.album}, {
                $pull: {
                    photos: {
                        filename: req.params.photo
                    }
                }
            },
            function (err, data) {
                albumService.removePhoto(
                    {
                        postedBy: req.params.username,
                        album: req.params.album,
                        photoName: req.params.photo
                    }
                );
                if (!err) {
                    res.send({res: data});
                } else
                    res.status(400).send(err);
            })
    };

    return {

        complainPhoto: complainPhoto,
        uploadPhotos: uploadPhotos,
        uploadAvatar: uploadAvatar,
        updatePhotoPrivacy: updatePhotoPrivacy,
        deletePhoto: deletePhoto,
        getPhotoById: getPhotoById
    };
};

module.exports = photoController;