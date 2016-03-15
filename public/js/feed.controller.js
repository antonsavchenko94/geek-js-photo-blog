(function () {
    angular
        .module('blog')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['AlbumsService', 'AuthService', '$rootScope'];

    function FeedController(AlbumsService, AuthService, $rootScope) {
        var vm = this;

        vm.feedPhotos = [];
        vm.albums = [];
        vm.getAllProfileAlbums = getAllProfileAlbums;

        getUserAlbumsList();
        getAllProfileAlbums();

        function getAllProfileAlbums() {
            AlbumsService.getAllProfileAlbums()
                .then(function (albums) {
                    vm.albums = AlbumsService.generatePhotoUrls(albums);
                    console.log(vm.albums);
                    getAllProfilePhotos();
                });
        }

        function getAllProfilePhotos() {
            vm.feedPhotos = []; // temp?

            if (vm.albums.length) {
                vm.albums.forEach(function (album) {
                    album.photos.forEach(function (photo) {
                        vm.feedPhotos.push(photo);
                    });
                });
            } else {
                vm.feedPhotos = vm.albums.photos
            }
        }

        function getUserAlbumsList() {
            if (!$rootScope.user) return;
            AlbumsService.getAlbumsList($rootScope.user.username).then(function (a) {
                vm.userAlbums = a;
            });
        }
    }
})();

