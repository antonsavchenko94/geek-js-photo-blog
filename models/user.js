var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var user = new Schema({
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    nickname:   { type: String, required: true },
    password:   { type: String, required: true },
    email:      { type: String, required: true },
    avatar:     { type: String, required: false }
});

user.set('autoIndex', true);
module.exports = mongoose.model('User', user);