var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  User.create(req.body, function (err, user) {
    if(err) {
      return next(err)
    }
    res.send(user);
  });
});

module.exports = router;
