(function () {
    angular
        .module('blog')
        .service('AlbumsService', AlbumsService);

    AlbumsService.$inject = ['$http', '$rootScope', '$timeout', 'Upload'];

    function AlbumsService($http, $rootScope, $timeout, Upload) {
        return {
            createAlbum: createAlbum,
            getAlbums: getAlbums,
            uploadPhotos: uploadPhotos
        };

        function createAlbum(album) {
            album.postedBy = $rootScope.user;
            $http.post('/api/album', album);
        }

        function getAlbums() {
            var albums = null;
            console.log(albums);

            $http.get.call('/api/album')
                .then(function (data) {
                    albums = data.data.albums;
                    console.log(albums);
                });
            console.log(albums);
            return albums;
        }

        function uploadPhotos(photos, albumId) {

            if (photos && photos.length) {
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
                            $timeout(function() {
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
    }
})();

