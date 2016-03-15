var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var token = new Schema({
    value: { type: String, required: true }
});

token.set('autoIndex', true);
module.exports = mongoose.model('Token', token);