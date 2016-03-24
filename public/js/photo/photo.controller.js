(function () {
    angular
        .module('blog')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['AlbumsService', '$routeParams', '$rootScope', '$http'];

    function PhotoController(AlbumsService, $routeParams, $rootScope, $http) {
        var vm = this;

        vm.photo = null;
        vm.currentUser = $rootScope.user;

        getPhotoById();

        function getPhotoById() {
            console.log();
            $http.get('/api/album/' + $routeParams.album_id + '/' + $routeParams.photo_id, {params: {user: vm.currentUser}})
                .then(function(res) {
                vm.photo = res.data.photo;
                vm.photo.url = '/assets/' + $routeParams.username + '/' + $routeParams.album_id + '/' + vm.photo.filename;
            })
        }
    }
})();
