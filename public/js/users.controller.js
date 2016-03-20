(function() {
    angular
        .module('blog')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$http'];

    function UsersController($http) {
        var vm = this;
        vm.users = [];

        $http.get('/api/users').then(function(data) {
            vm.users = data.data.users;
            vm.users.forEach(function(user) {
                user.avatar = user.avatar || "/images/no-avatar.png";
            })
        });
    }
})();
