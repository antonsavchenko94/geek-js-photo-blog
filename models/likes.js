var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var likes = new Schema({
    to:   { type: String, required: true},
    by:   [{user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}}]
});

likes.set('autoIndex', true);
module.exports = mongoose.model('Likes', likes);