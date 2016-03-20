(function () {
    angular
        .module('blog')
        .service('AlbumsService', AlbumsService);

    AlbumsService.$inject = ['$http', '$rootScope', '$timeout', 'Upload', '$q'];

    function AlbumsService($http, $rootScope, $timeout, Upload, $q) {
        return {
            removeAlbum: removeAlbum,
            createAlbum: createAlbum,
            getAlbumsList: getAlbumsList,
            uploadPhotos: uploadPhotos,
            getAlbumById: getAlbumById,
            openPhotos: openPhotos,
            generatePhotoUrls: generatePhotoUrls,
            createProfileAlbum: createProfileAlbum,
            getAllProfileAlbums: getAllProfileAlbums
        };

        function removeAlbum(id){
            $http.post('/api/album/remove', {id: id});
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
                var resolvedPromises = $q.all(photos.map(function(photo) {
                    var file = photo;
                    if (!file.$error) {
                       return Upload.upload({
                            url: 'api/album/uploadPhotos',
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

        function getAllProfileAlbums() {
            return $http.get('/api/shared/getAllProfileAlbums').then(function (data) {
                return data.data.albums;
            });
        }

        function generatePhotoUrls(albums, username){
            var a = [];
            a = a.concat(albums);
            a.map(function(album) {
                var user = album.postedBy.username ? album.postedBy.username : username;
                album.photos.map(function(photo) {
                    photo.imageUrl = "/assets/"
                        + user + "/"
                        + album._id + "/"
                        + photo.filename;
                    photo.pageUrl = "/user/"
                        + user + "/"
                        + album._id + "/"
                        + photo._id;
                });
            });

            return a.length == 1 ? a[0] : a;
        }
    }
})();

