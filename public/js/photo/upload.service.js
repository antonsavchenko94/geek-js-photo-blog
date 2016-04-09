(function () {
    angular
        .module('blog')
        .service('UploadService', UploadService);

    UploadService.$inject = ['$http', '$rootScope', '$timeout', 'Upload', '$q'];

    function UploadService($http, $rootScope, $timeout, Upload, $q) {
        return {
            uploadPhotos: uploadPhotos,
            openPhotos: openPhotos
        };

        function uploadPhotos(photos, albumId) {
            if (!albumId) {
                albumId = $rootScope.user._id;
            }
            if (photos && photos.length && albumId) {
                var resolvedPromises = $q.all(photos.map(function (file) {
                    if (!file.$error) {
                        var url = file.isAvatar
                            ? '/api/photo/uploadAvatar'
                            : '/api/photo/upload';
                        return Upload.upload({
                            url: url,
                            method: 'POST',
                            data: {
                                albumId: albumId,
                                user: $rootScope.user,
                                file: file
                            }
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
    }
})();

