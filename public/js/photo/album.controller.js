(function () {
    angular
        .module('blog')
        .controller('AlbumController', AlbumController);

    AlbumController.$inject = ['AlbumsService', 'LazyLoadService', '$routeParams', '$rootScope'];

    function AlbumController(AlbumsService, LazyLoadService, $routeParams, $rootScope) {
        var vm = this;

        var albumId = $routeParams.album_id;

        vm.isMyProfile = false;
        vm.album = [];
        vm.reloadAlbum = reloadAlbum;
        vm.getAlbumById = getAlbumById;

        reloadAlbum();

        function isMyProfile() {
            var authorizedProfile = $rootScope.user.username;
            var requestedProfile = $routeParams.username;
            return authorizedProfile == requestedProfile;
        }

        function reloadAlbum() {
            vm.album = [];
            LazyLoadService.refresh();
            getAlbumById();
        }

        function getAlbumById(param) {
            vm.isMyProfile = isMyProfile();
            var func = vm.isMyProfile ? 'getOwnAlbumById' : 'getAlbumById';

            return AlbumsService[func](albumId, param).then(function (res) {
                vm.album = vm.album.concat(AlbumsService.generatePhotoUrls(res.album));

                return res;
            });
        }
    }
})();
