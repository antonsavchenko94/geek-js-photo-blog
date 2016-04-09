(function () {
    angular
        .module('blog')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['AlbumsService', 'PhotoService', '$routeParams', '$rootScope', '$http', '$location'];

    function PhotoController(AlbumsService, PhotoService, $routeParams, $rootScope, $http, $location) {
        var vm = this;

        vm.photo = null;
        vm.currentUser = $rootScope.user;
        vm.complainText = 'Complain';
        vm.canDelete = $rootScope.user.username === $routeParams.username || $rootScope.user.isAdmin;

        getPhotoById();

        function getPhotoById() {
            PhotoService.getPhotoById()
                .then(function(photo) {
                vm.photo = photo;
            })
        }

        vm.complain = function () {
            PhotoService.complain().then(function(complainText) {
                vm.complainText = complainText;
            })
        };

        vm.deletePhoto = function () {
            vm.dialog = {
                title: 'Delete photo',
                body: '<h1>Photo with  \''+ vm.photo.filename +'\' will be deleted</h1>',
                onConfirm: function () {
                    $http.delete('/api/photo/delete/'
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
