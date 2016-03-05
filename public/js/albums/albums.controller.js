(function () {
    angular
        .module('blog')
        .controller('AlbumsController', AlbumsController);

    AlbumsController.$inject = ['AlbumsService', '$http'];

    function AlbumsController(AlbumsService, $http) {
        var vm = this;

        vm.albums = [];
        vm.photos = [];
        vm.profileAlbum = [];
        vm.albumId = null;

        vm.newAlbum = {};


        vm.createAlbum = createAlbum;
        vm.openPhotos = openPhotos;
        vm.uploadPhotos = uploadPhotos;
        vm.getProfileAlbum = getProfileAlbum;

        AlbumsService.createProfileAlbum();
        reloadAlbumsList();

        function createAlbum(title) {
            if (title) {
                AlbumsService.createAlbum({title: title});
                reloadAlbumsList();
                vm.newAlbum = {};
            }
        }

        function openPhotos(photos, errFiles) {
            vm.photos =  AlbumsService.openPhotos(photos, errFiles)
        }

        function uploadPhotos(photos) {
            AlbumsService.uploadPhotos(photos, vm.albumId);
            vm.photos = [];
        }

        function reloadAlbumsList(){
            vm.albums = AlbumsService.getAlbumsList();
            vm.albums.then(function (a) {
                vm.albums = a;
            });
            return vm.albums;
        }

        function getProfileAlbum(){
            vm.profieAlbum = AlbumsService.getAlbumById();
            vm.profileAlbum.then(function (a) {
                vm.profileAlbum = a;
            });
            return vm.album;
        }
    }

})();