(function () {
    angular
        .module('blog')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', '$location', '$rootScope', '$routeParams'];

    function AuthController(AuthService, $location, $rootScope, $routeParams) {
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
            AuthService.sendToken(vm.newUser.email, function (res) {
                showFlashMessage('info', res.data);
            })
        }

        function checkToken() {
            AuthService.checkToken(
                function (res) {
                    vm.newUser.email = res.data.email;
                    vm.token = true;
                },

                function (res) {
                    showFlashMessage('warning', res.data);
                })
        }

        function newPassword() {
            AuthService.newPassword(vm.temp.email, function (res) {
                console.log(res);
                if (res.status === 200) {
                    showFlashMessage('info', 'New password sent to ' + vm.temp.email + '. Check Your email box !!!');
                }
                $location.path('/');
            });
        }

        function showFlashMessage(type, text) {
            $rootScope.message = {type: type, text: text};
        }
    }
})();
