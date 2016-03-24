(function () {
    angular
        .module('blog')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['AlbumsService', '$rootScope'];

    function FeedController(AlbumsService, $rootScope) {
        var vm = this;

        vm.feedPhotos = [];
        vm.albums = [];
        vm.getAllProfileAlbums = getAllProfileAlbums;
        vm.loadMore = loadMore;
        vm.refresh = refresh;

        getUserAlbumsList();
        getAllProfileAlbums();

        function loadMore() {
            getAllProfileAlbums('more');
        }

        function getAllProfileAlbums(param) {
            AlbumsService.getAllProfileAlbums(param)
                .then(function (album) {
                    var photos = AlbumsService.generatePhotoUrls(album);
                    vm.feedPhotos = vm.feedPhotos.concat(photos);
                })
        }

        function refresh() {
            vm.feedPhotos = [];
            getAllProfileAlbums();
        }

        function getUserAlbumsList() {
            if (!$rootScope.user) return;
            AlbumsService.getAlbumsList($rootScope.user.username).then(function (a) {
                vm.userAlbums = a;
            });
        }
    }
})();

