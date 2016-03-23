(function () {
    angular
        .module('blog')
        .service('AlbumsService', AlbumsService);

    AlbumsService.$inject = ['$http', '$rootScope', '$timeout', 'Upload', '$q'];

    function AlbumsService($http, $rootScope, $timeout, Upload, $q) {
        return {
            removeAlbum: removeAlbum,
            editTitle: editTitle,
            createAlbum: createAlbum,
            getAlbumsList: getAlbumsList,
            uploadPhotos: uploadPhotos,
            getAlbumById: getAlbumById,
            openPhotos: openPhotos,
            generatePhotoUrls: generatePhotoUrls,
            createProfileAlbum: createProfileAlbum,
            getAllProfileAlbums: getAllProfileAlbums,
            getGlobalViews: getGlobalViews
        };

        function editTitle(album){
            return $http.post('/api/album/edit', {album: album}).then(function(data){
                return data.data.album;
            });
        }

        function removeAlbum(id){
            return $http.post('/api/album/remove', {id: id}).then(function () {
                return true;
            });
        }



        function createAlbum(album) {
            var url = album.isProfileAlbum
                ? '/api/shared/createProfileAlbum'
                : '/api/album/createNew';
            album.postedBy = album.postedBy || $rootScope.user;
            $http.post(url, album);
        }

        function createProfileAlbum(user) {
            var album = {
                title: 'Profile Album',
                isProfileAlbum: true,
                postedBy: user
            };
            createAlbum(album);
        }

        function getAlbumsList(username) {
            return $http.get('/api/album/getAll/' + username).then(function (data) {
                return data.data.albums;
            });
        }

        function getAlbumById(id) {
            return $http.get('/api/album/' + id).then(function (data) {
                return data.data.album;
            });
        }

        function uploadPhotos(photos, albumId) {
            if (!albumId) {
                albumId = $rootScope.user._id;
            }
            if (photos && photos.length && albumId) {
                var resolvedPromises = $q.all(photos.map(function(file) {
                    if (!file.$error) {
                        var url = file.isAvatar
                            ? '/api/album/uploadAvatar'
                            : '/api/album/uploadPhotos';
                        return Upload.upload({
                            url: url,
                            method: 'POST',
                            data: {
                                albumId: albumId,
                                user: $rootScope.user,
                                file: file
                            }
                        }).then(function (resp) {
                            $timeout(function () {
                                /*$scope.log = 'file: ' +
                                 resp.config.data.file.name +
                                 ', Response: ' + JSON.stringify(resp.data) +
                                 '\n' + $scope.log;*/

                            });
                        }, null, function (evt) {
                            /*var progressPercentage = parseInt(100.0 *
                             evt.loaded / evt.total);
                             $scope.log = 'progress: ' + progressPercentage +
                             '% ' + evt.config.data.file.name + '\n' +
                             $scope.log;*/
                        });
                    }
                }))
            }

            return resolvedPromises;
        }

        function openPhotos(photos, errFiles) {

            if (photos && !photos.length) {
                return [photos];
            } else {
                return photos;
            }
        }

        function getAllProfileAlbums(param) {
            return $http.get('/api/shared/getAllProfileAlbums/' + param).then(function (data) {
                return data.data.album;
            });
        }

        function generatePhotoUrls(album, username){
            album.map(function(photo) {
                var user = album.postedBy && album.postedBy.username ? album.postedBy.username : photo.postedBy.username;
                photo.imageUrl = "/assets/"
                    + user + "/"
                    + photo.album_id + "/"
                    + photo.filename;
                photo.pageUrl = "/user/"
                    + user + "/"
                    + photo.album_id + "/"
                    + photo._id;

                return photo;
            });

            return album;
        }

        function getGlobalViews(albums){
            return albums.reduce(function (sum, album) {
                return sum + album.photos.reduce(function (sum, photo) {
                    return sum + photo.view_count;
                },0)
            },0);
        }
    }
})();

