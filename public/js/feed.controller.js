(function () {
    angular
        .module('blog')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['AlbumsService', '$rootScope'];

    function FeedController(AlbumsService, $rootScope) {
        var vm = this;
        var noMoreData = false;

        vm.feedPhotos = [];
        vm.albums = [];
        vm.getAllProfileAlbums = getAllProfileAlbums;
        vm.loadMore = loadMore;
        vm.refresh = refresh;

        getUserAlbumsList();
        getAllProfileAlbums();

        function loadMore() {
            if (!noMoreData) {
                getAllProfileAlbums('more');
            }
        }

        function getAllProfileAlbums(param) {
            AlbumsService.getAllProfileAlbums(param)
                .then(function (res) {
                    var photos = AlbumsService.generatePhotoUrls(res.album);
                    vm.feedPhotos = vm.feedPhotos.concat(photos);
                    noMoreData = res.noMoreData;
                })
        }

        function refresh() {
            vm.feedPhotos = [];
            noMoreData = false;
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

