var express = require('express');
var Comment = require('../models/comment');
var Album = require('../models/album');
var router = express.Router();

router.get('/:photo', function (req, res) {
    var photoId = req.params.photo;
    Album
        .findOne(
            {'photos': {$elemMatch: {_id: photoId, status: {$ne: 'no-comment'}}}},
            function (err, data) {
                if (data) {
                    Comment
                        .find({'postedTo': photoId})
                        .populate('postedBy')
                        .exec(function (err, comments) {
                            res.send(comments);
                        })
                } else {
                    res.send([]);
                }
            });
});

router.post('/save', function (req, res) {
    var comment = req.body;
    Comment.create(comment, function (err, comment) {
        if (err)
            res.status(400).send(err);
        else
            res.status(200).send('Comment successfully saved !!!');
    })
});

module.exports = router;