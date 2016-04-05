var User = require('../models/user');
var BanList = require('../models/banList');

var checkBanList = function () {
    BanList.find({})
        .populate('user')
        .exec(function(err, items){
            items.forEach(function (item, i, arr) {
                var diff = new Date() - item.timeStart;
                if(diff>= 86400000  ){ //86400000 = 24h
                    User.findById(item.user._id, function(err, user){
                        user.status = 'active';
                        user.save();
                    });
                    BanList.remove(item, function(err){
                        if(err) console.log(err);
                    })
                }
            })
        })
};

var check =  setInterval(checkBanList, 86400000); //every 24h

module.exports = check;