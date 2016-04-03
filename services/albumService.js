var path = require('path');
var fs = require('fs');

var albumService = function () {

    var mkdir = function (path) {
        try {
            fs.mkdirSync(path);
        } catch (e) {
            if (e.code != 'EEXIST' && e.code != 'EPERM') throw e;
        }
    };

    var mkdirPath = function (dirPath) {
        var pathParts = dirPath.split(path.sep);

        for (var i = 1; i <= pathParts.length; i++) {
            mkdir(path.join.apply(null, pathParts.slice(0, i)));
        }
    };

    var remdirPath = function (dirPath) {
        rmdirAsync(dirPath, function(err){
            if (err) {
                throw err;
            }
        })
    };

    var remPhotoPath = function (photoPath) {
        try {
            fs.unlinkSync(photoPath);
        }catch (err){
            throw err;
        }

    };

    var getAlbumPath = function (album) {

        var s = path.sep;

        return path.normalize(
            '.' + s
            + 'assets' + s
            + album.postedBy.username + s
            + album._id
        );
    };

    var getPhotoPath = function (photo) {
        var s = path.sep;
        return path.normalize(
            'assets' + s
            + photo.postedBy + s
            + photo.album + s
            + photo.photoName
        );
    };

    var getUserPath = function (user) {
        var s = path.sep;
        return path.normalize(
            'assets' + s
            + user.username
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
                    cb(null, './assets/' + req.body.user.username);
                },
                filename: function (req, file, cb) {
                    var extension = "." + file.originalname.split('.').pop();
                    cb(null, "avatar" + extension);
                }
            }
        };
    };

    var removeAlbum = function (album) {
        try {
            remdirPath(getAlbumPath(album));
        }catch (err){
            throw err;
        }
    };

    var removeUserDir = function (userDir) {
        try {
            remdirPath(getUserPath(userDir));
        }catch (err){
            throw err;
        }
    };

    var removePhoto = function (photo) {
            try {
                remPhotoPath(getPhotoPath(photo));
            }catch (err){
                throw err;
            }
        };

    var rmdirAsync = function(path, callback) {
        fs.readdir(path, function(err, files) {
            if(err) {
                // Pass the error on to callback
                callback(err, []);
                return;
            }
            var wait = files.length,
                count = 0,
                folderDone = function(err) {
                    count++;
                    // If we cleaned out all the files, continue
                    if( count >= wait || err) {
                        fs.rmdir(path,callback);
                    }
                };
            // Empty directory to bail early
            if(!wait) {
                folderDone();
                return;
            }

            // Remove one or more trailing slash to keep from doubling up
            path = path.replace(/\/+$/,"");
            files.forEach(function(file) {
                var curPath = path + "/" + file;
                fs.lstat(curPath, function(err, stats) {
                    if( err ) {
                        callback(err, []);
                        return;
                    }
                    if( stats.isDirectory() ) {
                        rmdirAsync(curPath, folderDone);
                    } else {
                        fs.unlink(curPath, folderDone);
                    }
                });
            });
        });
    };

    return {
        mkdir: mkdir,
        mkdirPath: mkdirPath,
        getAlbumPath: getAlbumPath,
        createAlbumDirectory: createAlbumDirectory,
        uploadParams: uploadParams,
        removeUserDir:removeUserDir,
        removeAlbum:removeAlbum,
        removePhoto:removePhoto
    };
};

module.exports = albumService;
