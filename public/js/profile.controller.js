(function() {
    angular
        .module('blog')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$http', '$routeParams', '$rootScope'];

    function ProfileController($http, $routeParams, $rootScope) {
        var vm = this;
        vm.myProfile = false;

        getUserData();
        
        // get user info to fill profile and check if it is profile of authorised user
        function getUserData() {
            $http.get('/users/' + $routeParams.username)
                .then(function(data) {
                    vm.user = data.data.user;

                    if ($rootScope.user && vm.user.username === $rootScope.user.username) {
                        vm.myProfile = true;
                    }
                });
        }
    }
})();
