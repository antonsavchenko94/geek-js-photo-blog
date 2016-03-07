(function () {
    angular
        .module('blog')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['AlbumsService', '$location', '$http', '$routeParams'];

    function FeedController(AlbumsService, $location, $http, $routeParams) {
        var vm = this;

        vm.photos = [];
        vm.albums = [];
        vm.msg = 'qqq';

        getAllProfileAlbums();

        function getAllProfileAlbums() {
            AlbumsService.getAllProfileAlbums()
                .then(function (albums) {
                    vm.albums = albums;
                    getAllProfilePhotos();
                });
        }

        function getAllProfilePhotos() {
            vm.albums.forEach(function (album, i, albums) {
                album.photos.forEach(function (photo, i, photos) {
                    photo.url = "/assets/"
                        + album.postedBy.username + "/"
                        + album._id + "/"
                        + photo.filename;
                    vm.photos.push(photo);
                });
            });
            return vm.photos;
        }

    }
})();

