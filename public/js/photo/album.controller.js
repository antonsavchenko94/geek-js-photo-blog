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
            AlbumsService.getAlbumById(albumId, param).then(function (res) {
                vm.album = vm.album.concat(AlbumsService.generatePhotoUrls(res.album));
                noMoreData = res.noMoreData;
                vm.isMyProfile = isMyProfile() || false;
            });
        }

        function loadMore() {
            if (!noMoreData) {
                getAlbumById('more');
            }
        }
    }
})();
