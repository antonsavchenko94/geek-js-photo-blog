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
                console.log('LOADING...');
                getAllProfileAlbums();
            }
        }

        function getAllProfileAlbums() {
            AlbumsService.getAllProfileAlbums()
                .then(function (album) {
                    var photos = AlbumsService.generatePhotoUrls(album);
                    vm.feedPhotos = [].concat(vm.feedPhotos, photos);
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

