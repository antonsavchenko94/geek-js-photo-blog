(function () {
    angular
        .module('blog')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', '$location', '$rootScope', '$routeParams', 'AlbumsService', 'FlashMessage'];

    function AuthController(AuthService, $location, $rootScope, $routeParams, AlbumsService, FlashMessage) {
        var vm = this;

        vm.login = login;
        vm.register = register;
        vm.sendToken = sendToken;
        vm.newPassword = newPassword;
        vm.newUser = {};
        vm.message = '';
        vm.temp = {};
        vm.token = false;
        vm.passRecover = false;

        if ($routeParams.token) {
            checkToken();
        }

        function register() {
            AuthService.register(vm.newUser, function(res) {
                AlbumsService.createProfileAlbum(res.data.user);
                saveUserAndRedirect(null, '/login');
            })
        }

        function login() {
            AuthService.login(vm.newUser, function (res) {
                saveUserAndRedirect(res, '/');
            });
        }

        function saveUserAndRedirect(res, redirectTo) {
            $rootScope.user = res && res.data.user ? res.data.user : null;
            $location.path(redirectTo);
        }

        function sendToken() {
            AuthService.sendToken(vm.newUser.email)
                .catch(function(err) {
                    vm.newUser.email = '';
                })
        }

        function checkToken() {
            AuthService.checkToken(
                function (res) {
                    vm.newUser.email = res.data.email;
                    vm.token = true;
                })
        }

        function newPassword() {
            AuthService.newPassword(vm.temp.email, function (res) {
                $location.path('/login');
            });
        }
    }
})();
