(function () {
    angular
        .module('blog')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$http', '$routeParams', '$rootScope', 'AlbumsService', 'AuthService'];

    function ProfileController($http, $routeParams, $rootScope, AlbumsService, AuthService) {
        var vm = this;

        vm.user = {};
        vm.myProfile = false;
        vm.info = {};
        vm.profileAlbum = [];

        vm.toggleFollow = toggleFollow;
        vm.update = updateUserInfo;
        vm.getProfileAlbum = getProfileAlbum;

        getUserData();

        // reload list of albums and photos
        getProfileAlbum();

        // get user info to fill profile and check if it is profile of current user
        function getUserData() {
            if (!$routeParams.username) return;

            $http.get('/api/users/' + $routeParams.username, {params: {visitorId: $rootScope.user._id}})
                .then(function (data) {
                    vm.user = data.data.user;
                    vm.user.avatar = vm.user.avatar || "/images/no-avatar.png";

                    toggleFollowButton(data.data.followedByVisitor);

                    vm.myProfile = AuthService.isMyProfile(vm.user);
                });
        }

        function updateUserInfo() {
            $http.put('/api/users', vm.info).then(function() {
                vm.info = null;
            })
        }

        function getProfileAlbum(param) {
            if (!$routeParams.username) return;

            return AlbumsService.getProfileAlbum($routeParams.username, param)
                .then(function (res) {
                    var photos = AlbumsService.generatePhotoUrls(res.album);
                    vm.profileAlbum = vm.profileAlbum.concat(photos);

                    return res;
                    //vm.user.globalViews = AlbumsService.getGlobalViews(a);
                });
        }

        function toggleFollow() {
            $http.put('/api/users/toggleFollow/' + $routeParams.username, {
                follower: $rootScope.user
            }).then(function () {
                getUserData();
            });
        }

        function toggleFollowButton(isFollowedByMe){
            var button = angular.element(document.querySelector("#follow-button"))[0];
            button.innerHTML = isFollowedByMe ? 'Following' : 'Follow';
        }
    }
})();
