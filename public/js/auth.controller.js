(function() {
    angular
        .module('blog')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', '$location'];

    function AuthController(AuthService, $location) {
        var vm = this;

        vm.login = login;
        vm.register = register;
        vm.newUser = {};
        vm.message = '';

        function register() {
            AuthService.register(vm.newUser)
                .then(function(message) {
                    message ? vm.message = message : $location.path('/login');
                })
        }

        function login() {
            AuthService.login(vm.newUser)
                .then(function(message) {
                    message ? vm.message = message : $location.path('/');
                })
        }
    }
})();
