var Likes = require('../models/likes');

var likesController = function () {

    var middleware = function (req, res, next) {
        next();
    };

    var togglePhotoLikes = function (req, res, next) {

        var photo_id = req.body.photo_id;
        var user = req.body.currentUser;

        var query = function (param, cb) {
            Likes.findOneAndUpdate(
                {'to': photo_id + ''},
                param,
                {
                    new: true,
                    upsert: true
                },
                function (err, likes) {
                    if (err) {
                        console.log(err);
                    }
                    cb(likes);
                }
            )
        };

        Likes.findOne(
            {'to': photo_id + ''},
            {'by': {$elemMatch: {user: user._id + ''}}},
            function (err, likes) {
                if (likes && likes.by.length != 0) {
                    query({$pull: {by: {user: user._id + ''}}}, function (likes) {
                        res.send({likes: likes, liked: false})
                    })
                } else {
                    query({$push: {by: {user: user._id + ''}}}, function (likes) {
                        res.send({likes: likes, liked: true})
                    })
                }
            });
    };

    var getLikes = function (req, res, next) {

        var photo_id = req.body.params.id;
        var user_id = req.body.params.user_id;
        var liked = false;

        Likes.findOne(
            {'to': photo_id + ''},
            {'by': {$elemMatch: {user: user_id + ''}}},
            function (err, likes) {
                if(err){
                    console.log(err);
                }

                liked = !!(likes && likes.by.length);

                Likes.findOne(
                    {'to': photo_id + ''},
                    function (err, likes) {
                        if(err){
                            console.log(err);
                        }
                        res.send({likes: likes, liked: liked})
                    }
                );
            });

    };

    return {
        middleware: middleware,
        togglePhotoLikes: togglePhotoLikes,
        getLikes: getLikes
    };
};

module.exports = likesController;