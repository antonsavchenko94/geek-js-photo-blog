(function () {
    angular
        .module('blog')
        .service('AlbumsService', AlbumsService);

    AlbumsService.$inject = ['$http', '$rootScope', '$timeout', 'Upload'];

    function AlbumsService($http, $rootScope, $timeout, Upload) {
        return {
            createAlbum: createAlbum,
            getAlbumsList: getAlbumsList,
            uploadPhotos: uploadPhotos,
            getAlbumById: getAlbumById,
            openPhotos: openPhotos,
            createProfileAlbum: createProfileAlbum
        };

        function createAlbum(album) {
            album.postedBy = $rootScope.user;
            $http.post('/api/album', album);
        }

        function createProfileAlbum() {
            var album = {
                title: 'Profile Album',
                isProfileAlbum: true
            };
            createAlbum(album);
        }

        function getAlbumsList() {
            return $http.get('/api/album').then(function (data) {
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
                for (var i = 0; i < photos.length; i++) {
                    var file = photos[i];
                    if (!file.$error) {
                        Upload.upload({
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
                }
            }
        }

        function openPhotos(photos, errFiles) {

            if (photos && !photos.length) {
                return [photos];
            } else {
                return photos;
            }
        }
    }
})();

