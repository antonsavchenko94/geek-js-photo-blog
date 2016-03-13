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
            });
        }
    }
})();