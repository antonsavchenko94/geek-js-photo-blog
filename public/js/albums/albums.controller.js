(function () {
    angular
        .module('blog')
        .controller('AlbumsController', AlbumsController);

    AlbumsController.$inject = ['AlbumsService', '$rootScope', '$routeParams'];

    function AlbumsController(AlbumsService, $rootScope, $routeParams) {
        var vm = this;

        vm.title = '';
        vm.newAlbum = {};
        vm.user = {username: $routeParams.username || $rootScope.user};
        vm.myProfile = vm.user.username === $rootScope.user.username;
        vm.albumCovers = [];

        vm.createAlbum = createAlbum;

        reloadAlbumsList(vm.user.username);

        function createAlbum(title) {
            if (title) {
                AlbumsService.createAlbum({title: title});
                reloadAlbumsList(vm.user.username);
                vm.newAlbum = {};
                vm.title = '';
            }
        }

        function reloadAlbumsList(username) {
            if (!username) return;
            AlbumsService.getAlbumsList(username).then(function (a) {
                vm.albums = a;
                getAlbumCovers(vm.albums);
            });
        }

        function getAlbumCovers(albums) {
            albums.forEach(function(album) {
                album.cover = {
                    pageUrl: '/user/' + vm.user.username + '/' + album._id,
                    title: album.title
                };

                album.cover.imageUrl = (album.photos.length > 0)
                    ? '/assets/' + vm.user.username + "/" +album._id + "/" + album.photos.pop().filename
                    : '/images/no-image.jpg';

                vm.albumCovers.push(album.cover);
            });
        }
    }
})();