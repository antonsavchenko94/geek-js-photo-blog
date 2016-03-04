(function() {
    angular
        .module('blog')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$http', '$routeParams', '$rootScope'];

    function ProfileController($http, $routeParams, $rootScope) {
        var vm = this;
        vm.myProfile = false;
        vm.info = {};

        vm.update = update;
        vm.setTab = setTab;

        getUserData();

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

        function setTab(tab) {
            vm.tab = tab;
            vm.info = {};
            $rootScope.message = null;
        }
    }
})();
