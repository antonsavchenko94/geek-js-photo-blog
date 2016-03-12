(function () {
    angular
        .module('blog')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['AlbumsService', 'AuthService', '$rootScope'];

    function FeedController(AlbumsService, AuthService, $rootScope) {
        var vm = this;

        vm.feedPhotos = [];
        vm.photos = [];
        vm.albums = [];
        vm.userAlbums = [];
        vm.profileAlbum = [];

        getUserAlbumsList();
        getAllProfileAlbums();

        vm.openPhotos = openPhotos;
        vm.uploadPhotos = uploadPhotos;

        function getAllProfileAlbums() {
            AlbumsService.getAllProfileAlbums()
                .then(function (albums) {
                    vm.albums = AlbumsService.generatePhotoUrls(albums);
                    getAllProfilePhotos();
                });
        }

        function getAllProfilePhotos() {
            vm.albums.forEach(function (album) {
                album.photos.forEach(function (photo) {
                    vm.feedPhotos.push(photo);
                });
            });
        }

        function openPhotos(photos, errFiles) {
            vm.photos = AlbumsService.openPhotos(photos, errFiles);
        }

        function uploadPhotos(photos, albumId) {
            if (!albumId)
                albumId = vm.profileAlbum._id;
            AlbumsService.uploadPhotos(photos, albumId);
            vm.photos = [];
            vm.albumId = null;
        }

        function getUserAlbumsList() {
            if (!$rootScope.user) return;
            vm.userAlbums = AlbumsService.getAlbumsList($rootScope.user.username);
            vm.userAlbums.then(function (a) {
                vm.userAlbums = a.slice(1, a.length);
                vm.profileAlbum = a[0];
            });
            return vm.userAlbums;
        }
    }
})();

