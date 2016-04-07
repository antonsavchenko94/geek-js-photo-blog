(function () {
    angular
        .module('blog')
        .controller('AlbumController', AlbumController);

    AlbumController.$inject = ['AlbumsService', 'AuthService', 'LazyLoadService', '$routeParams'];

    function AlbumController(AlbumsService, AuthService, LazyLoadService, $routeParams) {
        var vm = this;

        var albumId = $routeParams.album_id;

        vm.isMyProfile = false;
        vm.album = [];
        vm.reloadAlbum = reloadAlbum;
        vm.getAlbumById = getAlbumById;

        reloadAlbum();

        function reloadAlbum() {
            vm.album = [];
            LazyLoadService.refresh();
            getAlbumById();
        }

        function getAlbumById(param) {
            vm.isMyProfile = AuthService.isMyProfile($routeParams.username);
            var func = vm.isMyProfile ? 'getOwnAlbumById' : 'getAlbumById';

            return AlbumsService[func](albumId, param).then(function (res) {
                vm.album = vm.album.concat(AlbumsService.generatePhotoUrls(res.album));

                return res;
            });
        }
    }
})();
