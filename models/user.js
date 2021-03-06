var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var user = new Schema({
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    username:   { type: String, required: true, unique: true },
    password:   { type: String, required: true, select: false },
    email:      { type: String, required: true },
    avatar:     { type: String, required: false },
    isAdmin:    { type: Boolean, required: false },
    status:     { type: String, default: 'active', enum:['baned', 'active', 'notActive']},
    global_views: { type: Number, required: false, default: 0},
    following:  [{user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],
    followers:  [{user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}}]
});

user.set('autoIndex', true);
module.exports = mongoose.model('User', user);