var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');

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
  User.findOne({username: req.params.username}, function(err, user) {
    if (err) {
      console.log(err);
      next(err);
    }

    res.send({user: user});
  });
});

router.put('/', function(req, res, next) {
  parseInfo(req, function(err, info) {
    if (err) {
      return res.status(err.status).send({message: err.message});
    }

    User.findByIdAndUpdate(req.user.id, info, function(err, user) {
      res.send({message: 'Your data has been successfully changed.'});
    })
  });
});

function parseInfo(req, cb) {
  var info = req.body;
  if (info.password) {
    if (!(info.password.current && info.password.new && info.password.repeat)) {
      return cb({status: 400, message: 'Missing required data.'})
    }

    bcrypt.compare(info.password.current, req.user.password, function (err, match) {
      if (!match) {
        return cb({status: 400, message: 'Incorrect current password.'});
      }

      if (info.password.new !== info.password.repeat) {
        return cb({status: 400, message: 'New passwords don\'t match.'});
      }

      info.password = bcrypt.hashSync(info.password.new, bcrypt.genSaltSync(10));

      return cb(null, info);
    });
  } else {
    return cb(null, info);
  }
}

module.exports = router;
