var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var comment = new Schema({
    value:      { type: String, required: true },
    postedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postedTo:   { type: String, required: true},
    datePosted: { type: Date, default: Date.now }
});

comment.set('autoIndex', true);
module.exports = mongoose.model('Comment', comment);