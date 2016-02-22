var express = require('express');
var User = require('../models/user');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('admin/index');
});

router.get('/users',function(req, res){
    User.find({}, function(err, users){
        if(!err)
            res.send(users);
        else
            res.send(err);
    })
});
router.delete('/users/:id', function(req, res){
    var id = req.params.id;
    User.findByIdAndRemove(id, function(err, offer){
      if(err) throw err;
        else
            res.sendStatus(200);
    })
});

module.exports = router;
