(function () {
    angular
        .module('blog')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['AlbumsService', '$routeParams', '$rootScope', '$http', '$location'];

    function PhotoController(AlbumsService, $routeParams, $rootScope, $http, $location) {
        var vm = this;

        vm.photo = null;
        vm.currentUser = $rootScope.user;
        vm.complainText = 'Complain';
        vm.canDelete = $rootScope.user.username === $routeParams.username || $rootScope.user.isAdmin;

        getPhotoById();

        function getPhotoById() {
            $http.get('/api/album/' + $routeParams.album_id + '/' + $routeParams.photo_id, {params: {user: vm.currentUser}})
                .then(function(res) {
                vm.photo = res.data.photo;
                vm.photo.url = '/' + $routeParams.username + '/' + $routeParams.album_id + '/' + vm.photo.filename;
            })
        }

        vm.complain = function () {
            $http.get('/api/album/complain/' + $routeParams.album_id + '/' + $routeParams.photo_id).then(function(res) {
                vm.complainText = res.data;
            })
        };

        vm.deletePhoto = function () {
            vm.dialog = {
                title: 'Delete photo',
                body: '<h1>Photo with  \''+ vm.photo.filename +'\' will be deleted</h1>',
                onConfirm: function () {
                    $http.delete('/api/album/delete/'
                        + $routeParams.username + '/'
                        + $routeParams.album_id + '/'
                        + vm.photo.filename)
                        .then(function(res) {
                            $location.path('/user/'+ $routeParams.username + '/' + $routeParams.album_id);
                    })
                }
            };
            vm.dialogVisible = true;
        }
    }
})();
