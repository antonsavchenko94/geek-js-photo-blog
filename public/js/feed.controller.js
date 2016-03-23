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
        vm.loadMore = loadMore;
        vm.allPhotosLoaded = false;

        getUserAlbumsList();
        getAllProfileAlbums();

        function loadMore() {
            if (!vm.allPhotosLoaded){
                console.log('LOADING...' + new Date());
                return getAllProfileAlbums('loadMore');
            }
        }

        function getAllProfileAlbums(option) {
            console.log('============');
            console.dir(vm.feedPhotos);
            return AlbumsService.getAllProfileAlbums(option)
                .then(function (album) {
                    var photos = AlbumsService.generatePhotoUrls(album);
                    console.dir(photos);
                    vm.feedPhotos = vm.feedPhotos.concat(photos);
                    console.dir(vm.feedPhotos);
                })
        }

        function getUserAlbumsList() {
            if (!$rootScope.user) return;
            AlbumsService.getAlbumsList($rootScope.user.username).then(function (a) {
                vm.userAlbums = a;
            });
        }
    }
})();

