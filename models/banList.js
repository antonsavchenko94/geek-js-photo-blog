var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var banList = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeStart: { type: Date, default: Date.now }
});

banList.set('autoIndex', true);
module.exports = mongoose.model('BanList', banList);