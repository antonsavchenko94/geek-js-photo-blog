(function () {
    angular
        .module('blog')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['AlbumsService', 'LazyLoadService', '$rootScope'];

    function FeedController(AlbumsService, LazyLoadService, $rootScope) {
        var vm = this;

        vm.feedPhotos = [];
        if ($rootScope.user) {
            vm.baned = $rootScope.user.status =='baned';
        }
        vm.albums = [];
        vm.getAllProfileAlbums = getAllProfileAlbums;
        vm.refresh = refresh;

        getUserAlbumsList();
        getAllProfileAlbums();

        function getAllProfileAlbums(param) {
            return AlbumsService.getAllProfileAlbums(param)
                .then(function (res) {
                    var photos = AlbumsService.generatePhotoUrls(res.album);
                    vm.feedPhotos = vm.feedPhotos.concat(photos);

                    return res;
                })
        }

        function refresh() {
            vm.feedPhotos = [];
            LazyLoadService.refresh();
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

