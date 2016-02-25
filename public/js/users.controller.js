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
        })
    }
})();
