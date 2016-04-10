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

router.get('/page/:pageNum', function(req, res, next) {

    var pageLimit = 10;
    var currentPage = req.params.pageNum;
    var skipValue = pageLimit * (currentPage - 1);

    User.find({}, function (err, users) {
        if (err) {
            console.log(err);
        }

        var usersCount = users.length;
        var pagesCount = Math.ceil(usersCount / pageLimit);

        User.find()
            .skip(skipValue)
            .limit(pageLimit)
            .exec(function (err, data) {
                if (err) {
                    console.log(err);
                }
                res.send({
                    users: data,
                    usersCount: usersCount,
                    pagesCount: pagesCount
                    })
            });
    });

});

router.get('/:username', function(req, res, next) {
  var visitorId = req.query.visitorId;

    User.findOne({username: req.params.username}, function(err, user) {
    if (err) {
      console.log(err);
      next(err);
    }
    User.findOne(
        //{username: req.params.username},
        {'followers.user': visitorId + ''},
        function (err, follower) {
            if (err) {
                console.log(err);
                next(err);
            }
            res.send({user: user, followedByVisitor: !!follower});
        });

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

router.put('/toggleFollow/:username', function (req, res, next) {

    var follower = req.body.follower;
    var followedName = req.params.username;

    User.findOne(
      {'username': followedName},
      {'followers.user': follower._id},
      function (err, followed) {
          if(followed.followers.length != 0){
              unfollow(followed, follower, res);
          }
          else {
              follow(followed, follower, res);
          }
      }
  );
});

function unfollow(followed, follower, res) {
    User.findOneAndUpdate(
        {'_id': followed._id},
        {$pull: {followers: {user: follower._id + ''}}},
        {new: true},

        function (err, followedUser) {
            User.findOneAndUpdate(
                {'_id': follower._id + ''},
                {$pull: {following: {user: followed._id + ''}}},
                {new: true},

                function (err, followingUser) {
                    res.status(200);
                    res.end();
                }
            );
        }
    );
}

function follow(followed, follower, res) {
    User.findOneAndUpdate(
        {'_id': followed._id},
        {$push: {followers: {user: follower._id + ''}}},
        {new: true},

        function (err, followedUser) {
            User.findOneAndUpdate(
                {'_id': follower._id + ''},
                {$push: {following: {user: followed._id + ''}}},
                {new: true},

                function (err, followingUser) {
                    res.status(200);
                    res.end();
                }
            );
        }
    );
}

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
