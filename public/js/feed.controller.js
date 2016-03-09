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
        vm.feedAlbums = [];
        vm.userAlbums = [];
        vm.profileAlbum = [];
        vm.isLogged = false;
        vm.msg = 'qqq';

        getUserAlbumsList();
        getAllProfileAlbums();
        checkLoginStatus();

        vm.openPhotos = openPhotos;
        vm.uploadPhotos = uploadPhotos;

        function getAllProfileAlbums() {
            AlbumsService.getAllProfileAlbums()
                .then(function (albums) {
                    vm.albums = albums;
                    getAllProfilePhotos();
                });
        }

        function getAllProfilePhotos() {
            vm.albums.forEach(function (album) {
                album.photos.forEach(function (photo) {
                    photo.url = "/assets/"
                        + album.postedBy.username + "/"
                        + album._id + "/"
                        + photo.filename;
                    photo.pageUrl = "/user/"
                        + album.postedBy.username + "/"
                        + album._id + "/"
                        + photo._id;
                    vm.feedPhotos.push(photo);
                });
            });
            return vm.feedPhotos;
        }

        function checkLoginStatus(){
            AuthService.isLogged().then(function (data) {
                vm.isLogged = !!data.data.user || false;
                console.log(data.data);
            });
        }

        function openPhotos(photos, errFiles) {
            vm.photos = AlbumsService.openPhotos(photos, errFiles);
            console.log(vm.photos);
        }

        function uploadPhotos(photos, albumId) {
            if (!albumId)
                albumId = vm.profieAlbum._id;
            AlbumsService.uploadPhotos(photos, albumId);
            vm.photos = [];
            vm.albumId = null;
        }

        function getUserAlbumsList() {
            if (!$rootScope.user) return;
            vm.userAlbums = AlbumsService.getAlbumsList($rootScope.user.username);
            vm.userAlbums.then(function (a) {
                vm.userAlbums = a.slice(1, a.length);
                vm.profieAlbum = a[0];
            });
            return vm.userAlbums;
        }

    }
})();

