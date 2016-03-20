var express = require('express');
var Comment = require('../models/comment');
var router = express.Router();

router.get('/:photo', function(req, res){
    var photoId = req.params.photo;
    Comment
        .find({'postedTo': photoId})
        .populate('postedBy')
        .exec(function(err, comments){
            res.send(comments);
    })
});

router.post('/save', function(req, res){
    var comment = req.body;
    Comment.create(comment, function(err, comment){
        if(err)
            res.status(400).send(err);
        else
            res.status(200).send('Comment successfully saved !!!');
    })
});

module.exports = router;