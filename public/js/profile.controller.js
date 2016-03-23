(function() {
    angular
        .module('blog')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$http', '$routeParams', '$rootScope', 'AlbumsService'];

    function ProfileController($http, $routeParams, $rootScope, AlbumsService) {
        var vm = this;
        vm.user = {};
        vm.myProfile = false;
        vm.info = {};
        vm.profileAlbum = [];

        vm.update = update;

        getUserData();

        // reload list of albums and photos
        getProfileAlbum($routeParams.username);

        // get user info to fill profile and check if it is profile of current user
        function getUserData() {
            if (!$routeParams.username) return;
            $http.get('/api/users/' + $routeParams.username).then(function(data) {
                vm.user = data.data.user;
                vm.user.avatar = vm.user.avatar || "/images/no-avatar.png";

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

        function getProfileAlbum(username) {
            if (!username) return;
            AlbumsService.getAlbumsList(username).then(function (a) {
                vm.profileAlbum = a;
                vm.profileAlbum.photos = AlbumsService.generatePhotoUrls(vm.profileAlbum, username);
                console.log(vm.profileAlbum);
                vm.user.globalViews = AlbumsService.getGlobalViews(a);
            });
        }
    }
})();
