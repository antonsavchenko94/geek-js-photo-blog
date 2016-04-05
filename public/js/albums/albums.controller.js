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
        vm.myProfile = isMyProfile();
        vm.albumCovers = [];
        vm.baned = $rootScope.user.status == 'baned';

        vm.createAlbum = createAlbum;
        vm.reloadAlbumsList = reloadAlbumsList;

        reloadAlbumsList();

        function createAlbum(title) {
            if (title) {
                AlbumsService.createAlbum({title: title});
                reloadAlbumsList();
                vm.newAlbum = {};
                vm.title = '';
            }
        }

        function reloadAlbumsList() {
            var username = $routeParams.username;
            AlbumsService.getAlbumsList(username).then(function (a) {
                vm.albums = a;
                getAlbumCovers(vm.albums);
            });
        }

        function getAlbumCovers(albums) {
            vm.albumCovers = [];
            albums.forEach(function (album) {
                album.cover = {
                    albumId: album._id,
                    pageUrl: '/user/' + vm.user.username + '/' + album._id,
                    title: album.title
                };

                album.cover.imageUrl = (album.photos.length > 0)
                    ? '/' + vm.user.username + "/" + album._id + "/" + album.photos.pop().filename
                    : '/images/no-image.jpg';
                album.cover.editable = !album.isProfileAlbum && isMyProfile();
                album.cover.newTitle = '';

                vm.albumCovers.push(album.cover);
            });
        }

        function isMyProfile(){
            return vm.user.username === $rootScope.user.username;
        }
    }
})();