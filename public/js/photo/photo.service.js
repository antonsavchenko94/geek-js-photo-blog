(function () {
    angular
        .module('blog')
        .service('PhotoService', PhotoService);

    PhotoService.$inject = ['$http', '$routeParams'];

    function PhotoService($http, $routeParams) {
        return {

            toggleLikes: toggleLikes,
            getLikes: getLikes,
            getPhotoById: getPhotoById,
            complain: complain,
            setPrivacy: setPrivacy
        };

        function toggleLikes(photo_id) {
            return $http.put('/api/photo/likes/' + photo_id, null).then(function (data) {
                return data.data;
            });
        }

        function getLikes(photo_id) {
            return $http.get('/api/photo/likes/' + photo_id).then(function (data) {
                return data.data;
            });
        }

        function getPhotoById() {
            return $http.get('/api/photo/'
                + $routeParams.username + '/'
                + $routeParams.album_id + '/'
                + $routeParams.photo_id).then(function(res) {
                    var photo = res.data.photo;
                    photo.url = '/' + $routeParams.username + '/' + $routeParams.album_id + '/' + photo.filename;
                    return photo;
                })
        }

        function complain() {
            return $http.get('/api/photo/complain/' + $routeParams.album_id + '/' + $routeParams.photo_id).then(function(res) {
                return res.data;
            })
        }

        function setPrivacy(photo) {
            return $http.put('/api/photo/privacy', {photo: photo}).then(function (data) {
                return data.data.photo.status;
            });
        }

    }
})();

