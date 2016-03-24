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

        vm.updateUserInfo = updateUserInfo;
        vm.loadMore = loadMore;

        getUserData();

        // reload list of albums and photos
        getProfileAlbum();

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

        function updateUserInfo() {
            $http.put('/api/users', vm.info).then(function() {
                vm.info = null;
            })
        }

        function getProfileAlbum(param) {
            if (!$routeParams.username) return;
            AlbumsService.getProfileAlbum($routeParams.username, param).then(function (a) {
                var photos = AlbumsService.generatePhotoUrls(a);
                vm.profileAlbum = vm.profileAlbum.concat(photos);
                //vm.user.globalViews = AlbumsService.getGlobalViews(a);
            });
        }

        function loadMore() {
            getProfileAlbum('more');
        }
    }
})();
