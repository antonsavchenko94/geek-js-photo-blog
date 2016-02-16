var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var album = new Schema({
    title:      { type: String, required: true },
    postedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phothos:    [
        {
            filename: {type: String, required: true},
            uploaded: {type: Date, required: true},
            status: {
                type: String,
                default: 'public',
                enum:['private', 'public', 'no-comment']
            },
            view_count: {type: Number},
            pic: {type: String, required: true}
        }
    ],
    created:    { type: Date }
});

album.set('autoIndex', true);
module.exports = mongoose.model('Album', album);