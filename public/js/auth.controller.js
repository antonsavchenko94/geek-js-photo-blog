(function() {
    angular
        .module('blog')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', '$location'];

    function AuthController(AuthService, $location) {
        var vm = this;

        vm.login = login;
        vm.register = register;
        vm.logout = logout;
        vm.newUser = {};

        function register() {
            AuthService.register(getUserCredentials())
                .then(redirectToHome);
        }

        function login() {
            AuthService.login(getUserCredentials())
                .then(redirectToHome);
        }

        function logout() {
            AuthService.logout()
                .then(redirectToHome);
        }

        function getUserCredentials() {
            var credentials = {};
            for (var key in vm.newUser) {
                if(vm.newUser.hasOwnProperty(key)) {
                    credentials[key] = vm.newUser[key];
                }
            }

            return credentials;
        }

        function redirectToHome() {
            $location.path('/');
        }
    }
})();
