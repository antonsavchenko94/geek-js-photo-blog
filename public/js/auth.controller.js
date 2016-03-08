(function() {
    angular
        .module('blog')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', 'AlbumsService', '$location', '$rootScope'];

    function AuthController(AuthService, AlbumsService, $location, $rootScope) {
        var vm = this;

        vm.login = login;
        vm.register = register;
        vm.newUser = {};
        vm.message = '';

        function register() {
            AuthService.register(vm.newUser, function(res) {
                AlbumsService.createProfileAlbum(res.data);
                console.log(res.data);
                saveUserAndRedirect(res, '/login');
            })
        }

        function login() {
            AuthService.login(vm.newUser, function(res) {
                saveUserAndRedirect(res, '/');
            });
        }

        function saveUserAndRedirect(res, redirectTo) {
            $rootScope.user = res.data.user ? res.data.user : null;
            $location.path(redirectTo);
        }
    }
})();
