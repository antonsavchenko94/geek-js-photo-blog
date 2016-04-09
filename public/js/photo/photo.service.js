(function () {
    angular
        .module('blog')
        .service('PhotoService', PhotoService);

    PhotoService.$inject = ['$http', '$rootScope', '$routeParams'];

    function PhotoService($http, $rootScope, $routeParams) {
        return {

            toggleLikes: toggleLikes,
            getLikes: getLikes,
            getPhotoById: getPhotoById,
            complain: complain,
            setPrivacy: setPrivacy
        };

        function toggleLikes(photo_id, album_id) {
            return $http.put('/api/photo/toggleLikes', {
                photo_id: photo_id,
                album_id: album_id,
                currentUser: $rootScope.user
            }).then(function (data) {
                return data.data;
            });
        }

        function getLikes(id) {
            return $http.post('/api/photo/getLikes', {
                params: {
                    id: id,
                    user_id: $rootScope.user._id
                }
            }).then(function (data) {
                return data.data;
            });
        }

        function getPhotoById() {
            return $http.get('/api/photo/' + $routeParams.album_id + '/' + $routeParams.photo_id, {params: {user: $rootScope.user}})
                .then(function(res) {
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
            return $http.put('/api/photo/updatePrivacy', {photo: photo}).then(function (data) {
                return data.data.photo.status;
            });
        }

    }
})();

