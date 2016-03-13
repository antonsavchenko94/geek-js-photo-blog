(function () {
    angular
        .module('blog')
        .controller('AlbumController', AlbumController);

    AlbumController.$inject = ['AlbumsService', '$routeParams', '$rootScope'];

    function AlbumController(AlbumsService, $routeParams, $rootScope) {
        var vm = this;

        var albumId = $routeParams.album_id;

        vm.isMyProfile = false;
        vm.album = {};
        vm.reloadAlbum = reloadAlbum;

        reloadAlbum();

        function isMyProfile() {
            var authorizedProfile = $rootScope.user._id;
            var requestedProfile = vm.album.postedBy._id;
            return authorizedProfile == requestedProfile;
        }

        function reloadAlbum() {
            vm.album = getAlbumById(albumId);
        }

        function getAlbumById(id) {
            vm.album = AlbumsService.getAlbumById(id);
            vm.album.then(function (a) {
                vm.album = AlbumsService.generatePhotoUrls(a);
                vm.isMyProfile = isMyProfile() || false;
            });
            return vm.album;
        }
    }
})();
