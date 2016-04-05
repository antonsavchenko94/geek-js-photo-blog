(function () {
    angular
        .module('blog')
        .controller('AlbumController', AlbumController);

    AlbumController.$inject = ['AlbumsService', '$routeParams', '$rootScope'];

    function AlbumController(AlbumsService, $routeParams, $rootScope) {
        var vm = this;

        var albumId = $routeParams.album_id;
        var noMoreData = false;

        vm.isMyProfile = false;
        vm.album = [];
        vm.reloadAlbum = reloadAlbum;
        vm.loadMore = loadMore;

        reloadAlbum();

        function isMyProfile() {
            var authorizedProfile = $rootScope.user.username;
            var requestedProfile = $routeParams.username;
            return authorizedProfile == requestedProfile;
        }

        function reloadAlbum() {
            vm.album = [];
            noMoreData = false;
            getAlbumById();
        }

        function getAlbumById(param) {
            vm.isMyProfile = isMyProfile() || false;
            if (vm.isMyProfile) {
                AlbumsService.getOwnAlbumById(albumId, param).then(function (res) {
                    generateUrls(res);
                });
            } else {
                AlbumsService.getAlbumById(albumId, param).then(function (res) {
                    generateUrls(res);
                });
            }
        }

        function loadMore() {
            if (!noMoreData) {
                getAlbumById('more');
            }
        }

        function generateUrls(res) {
            vm.album = vm.album.concat(AlbumsService.generatePhotoUrls(res.album));
            noMoreData = res.noMoreData;
        }
    }
})();
