(function () {
    angular
        .module('blog')
        .controller('AlbumsController', AlbumsController);

    AlbumsController.$inject = ['AlbumsService', '$http', '$rootScope'];

    function AlbumsController(AlbumsService, $rootScope) {
        var vm = this;

        vm.userAlbums = [];
        vm.mainAlbum = {};

        vm.photos = [];
        vm.profileAlbum = [];
        vm.albumId = null;
        vm.title = '';
        vm.newAlbum = {};


        vm.createAlbum = createAlbum;
        vm.openPhotos = openPhotos;
        vm.uploadPhotos = uploadPhotos;
        vm.getProfileAlbum = getProfileAlbum;

        reloadAlbumsList($rootScope.user.username);

        function createAlbum(title) {
            if (title) {
                AlbumsService.createAlbum({title: title});
                reloadAlbumsList($rootScope.user.username);
                vm.newAlbum = {};
                vm.title = '';
            }
        }

        function openPhotos(photos, errFiles) {
            vm.photos = AlbumsService.openPhotos(photos, errFiles)
        }

        function uploadPhotos(photos, albumId) {
            if (!albumId)
                albumId = vm.profieAlbum._id;
            AlbumsService.uploadPhotos(photos, albumId);
            vm.photos = [];
            vm.albumId = null;
        }

        function reloadAlbumsList(username) {
            if (!username) return;
            vm.albums = AlbumsService.getAlbumsList(username);
            vm.albums.then(function (a) {
                vm.albums = a;
                vm.userAlbums = a.slice(1, a.length);
                vm.profieAlbum = a[0];
            });
            return vm.albums;
        }

        function getProfileAlbum() {
            vm.profieAlbum = AlbumsService.getAlbumById();
            vm.profileAlbum.then(function (a) {
                vm.profileAlbum = a;
            });
            return vm.album;
        }
    }

})();