(function() {
    angular
        .module('blog')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$http', '$routeParams', '$rootScope', 'AlbumsService'];

    function ProfileController($http, $routeParams, $rootScope, AlbumsService) {
        var vm = this;
        vm.myProfile = false;
        vm.info = {};

        vm.userAlbums = [];
        vm.mainAlbum = {};
        vm.photos = [];
        vm.profileAlbum = [];
        vm.albumId = null;
        vm.newAlbum = {};

        vm.update = update;

        //albums methods
        vm.createAlbum = createAlbum;
        vm.openPhotos = openPhotos;
        vm.uploadPhotos = uploadPhotos;

        getUserData();

        // reload list of albums and photos
        reloadAlbumsList($routeParams.username);

        // get user info to fill profile and check if it is profile of current user
        function getUserData() {
            if (!$routeParams.username) return;
            $http.get('/api/users/' + $routeParams.username).then(function(data) {
                vm.user = data.data.user;

                if ($rootScope.user && vm.user.username === $rootScope.user.username) {
                    vm.myProfile = true;
                    $rootScope.user = vm.user;
                }
            });
        }

        function update() {
            $http.put('/api/users', vm.info).then(function() {
                vm.info = null;
            })
        }

        function createAlbum(title) {
            if (title) {
                AlbumsService.createAlbum({title: title});
                reloadAlbumsList($routeParams.username);
                vm.newAlbum = {};
                vm.title = '';
            }
        }

        function openPhotos(photos, errFiles) {
            vm.photos = AlbumsService.openPhotos(photos, errFiles)
        }

        function uploadPhotos(photos, albumId) {
            if (!albumId)
                albumId = vm.profileAlbum._id;
            AlbumsService.uploadPhotos(photos, albumId);
            vm.photos = [];
            vm.albumId = null;
        }

        function reloadAlbumsList(username) {
            if (!username) return;
            vm.albums = AlbumsService.getAlbumsList(username);
            vm.albums.then(function (a) {
                vm.albums = a;
                vm.userAlbums = a.slice(0, a.length - 1);
                vm.profileAlbum = a[0];
            });
            return vm.albums;
        }
    }
})();
