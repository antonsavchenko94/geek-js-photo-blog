var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
      next(err);
    }

    res.send({users: users});
  });
});

router.get('/:username', function(req, res, next) {
  User.findOne({username: req.params.username}, '-password', function(err, user) {
    if (err) {
      console.log(err);
      next(err);
    }

    res.send({user: user});
  });
});

module.exports = router;
