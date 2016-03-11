(function() {
    angular
        .module('blog')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthService', '$location', '$rootScope', '$routeParams'];

    function AuthController(AuthService, $location, $rootScope, $routeParams) {
        var vm = this;

        vm.login = login;
        vm.register = register;
        vm.sendToken = sendToken;
        vm.newUser = {};
        vm.message = '';
        vm.token = false;

        if ($routeParams.token) {
            checkToken();
        }

        function register() {
            AuthService.register(vm.newUser, function(res) {
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

        function sendToken() {
            AuthService.sendToken(vm.newUser.email)
        }

        function checkToken(){
            AuthService.checkToken(function(res){
                vm.newUser.email = res.data.email;
                console.log(res);
                vm.token = true;
            })
        }
    }
})();
