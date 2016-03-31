var express = require('express');
var User = require('../models/user');
var Album = require('../models/album');
var router = express.Router();

var albumService = require('../services/albumService.js')();

router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if (!err)
            res.send(users);
        else
            res.send(err);
    })
});
router.get('/users/:id', function (req, res) {
    var id = req.params.id;
    if (id)
        User.findOne({'_id': id}, function (err, users) {
            if (!err)
                res.send(users);
            else
                res.send(err);
        })
});
router.delete('/users/:id', function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
        if (err) throw err;
        else
            albumService.removeUserDir(user);
            user.remove(function(err,res){
                if(err){
                    res.status(500).send(err);
                }
            });
            Album.remove({postedBy: id}, function(err, res){
                if(err){
                    res.status(500).send(err);
                }
            });
            res.sendStatus(200);
    })
});

router.put('/users/:id', function (req, res) {
    var status = {status: req.body.status};
    var id = req.params.id;
    User.findByIdAndUpdate(id, status, function (err, offer) {
        if (err) throw err;
        else
            res.sendStatus(200);
    })
});

router.get('/complain/photos', function (req, res) {
    Album.aggregate([
        {$match: {photos:{$gte: [ "$$photo.complain", 5 ]}}},
        {$unwind: '$photos'},
        {$project: {
            album_id: '$_id',
            _id: '$photos._id',
            filename: '$photos.filename',
            uploaded: '$photos.uploaded',
            view_count: '$photos.view_count',
            status: '$photos.status',
            postedBy: '$postedBy',
            complain: '$photos.complain'
        }},
        { $sort : {uploaded : -1}}
    ], function(err, result) {
        Album.populate(result, 'postedBy', function(err, complain) {
            for(var i = 0; i<complain.length; i++){
                if(complain[i].complain === 0 || typeof complain[i].complain == 'undefined'){
                    complain.splice(i,1);
                    i-=1;
                }
            }
            res.send({complain: complain});
        })
    })
});

router.delete('/delete/:username/:album/:photo', function (req, res) {
    Album.update({_id:req.params.album}, {
        $pull: {
            photos: {
                filename:req.params.photo
            }
        }
    },
        function (err, data){
            albumService.removePhoto(
                {
                    postedBy: req.params.username,
                    album: req.params.album,
                    photoName: req.params.photo
                }
            );
            if(!err){
                res.send({res: data});
            }else
                res.status(400).send(err);
        })
});
module.exports = router;
