(function () {
    angular
        .module('blog')
        .controller('PhotoController', AlbumController);

    AlbumController.$inject = ['AlbumsService', '$location', '$http', '$routeParams', '$rootScope'];

    function AlbumController(AlbumsService, $location, $http, $routeParams, $rootScope) {
        var vm = this;

        var albumId = $routeParams.album_id;

        vm.isMyProfile = false;
        vm.msg = "";
        vm.album = {};
        vm.photos = [];
        vm.image = {
            filename: ""
        };
        vm.openPhotos = openPhotos;
        vm.uploadPhotos = uploadPhotos;
        vm.getPhoto = getPhoto;
        vm.getPhotoUrl = getPhotoUrl;

        reloadAlbum();

        function isMyProfile() {
            var authorizedProfile = $rootScope.user._id;
            var requestedProfile = vm.album.postedBy._id;
            return authorizedProfile == requestedProfile;
        }

        function reloadAlbum() {
            vm.album = getAlbumById(albumId);
        }

        function getAlbumById(id) {
            vm.album = AlbumsService.getAlbumById(id);
            vm.album.then(function (a) {
                vm.album = a;
                vm.isMyProfile = isMyProfile() || false;
            });
            return vm.album;
        }

        function openPhotos(photos, errFiles) {
            vm.photos =  AlbumsService.openPhotos(photos, errFiles)
        }

        function uploadPhotos(photos) {
            AlbumsService.uploadPhotos(photos, getAlbumId());
            vm.photos = [];
        }

        function getPhoto() {
            $http.get('/api/album/getPhoto/' + albumId)
                .then(function (data) {
                })
        }

        function getPhotoUrl(filename) {
            if (vm.album) {
                return "/assets/"
                    + vm.album.postedBy.username + "/"
                    + vm.album._id + "/"
                    + filename;
            }
        }

        function getAlbumId() {
            var path = $location.path().split("/");
            return path[path.length - 1];
        }

    }
})();
