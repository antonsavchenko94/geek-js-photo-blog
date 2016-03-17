var path = require('path');
var fs = require('fs');

var albumService = function () {

    var mkdir = function (path) {

        try {
            fs.mkdirSync(path);

        } catch (e) {
            if (e.code != 'EEXIST') throw e;
        }
    };

    var mkdirPath = function (dirPath) {
        var pathParts = dirPath.split(path.sep);

        for (var i = 1; i <= pathParts.length; i++) {
            mkdir(path.join.apply(null, pathParts.slice(0, i)));
        }
    };

    var getAlbumPath = function (album) {
        var s = path.sep;
        return path.normalize(
            '.' + s
            + 'public' + s
            + 'assets' + s
            + album.postedBy.username + s
            + album._id
        );
    };

    var createAlbumDirectory = function (album) {
        mkdirPath(getAlbumPath(album));
    };

    var uploadParams = function() {
        return {
            photos: {
                destination: function (req, file, cb) {
                    cb(null, getAlbumPath({
                        postedBy: req.body.user,
                        _id: req.body.albumId
                    }))
                },
                filename: function (req, file, cb) {
                    var extension = "." + file.originalname.split('.').pop();
                    cb(null, req.body.user._id + '_' + Date.now() + extension);
                }
            },
            avatar: {
                destination: function (req, file, cb) {
                    cb(null, './public/assets/' + req.body.user.username);
                },
                filename: function (req, file, cb) {
                    var extension = "." + file.originalname.split('.').pop();
                    cb(null, "avatar" + extension);
                }
            }
        };
    };

    return {
        mkdir: mkdir,
        mkdirPath: mkdirPath,
        getAlbumPath: getAlbumPath,
        createAlbumDirectory: createAlbumDirectory,
        uploadParams: uploadParams
    };
};

module.exports = albumService;
