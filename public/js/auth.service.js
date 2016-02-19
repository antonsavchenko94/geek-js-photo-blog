(function(){
    angular
        .module('blog')
        .service('AuthService', AuthService);

    AuthService.$inject = ['$http', '$rootScope'];

    function AuthService($http, $rootScope) {
        return {
            register: register,
            login: login,
            logout: logout,
            islogged: islogged
        };

        function register(user) {
            return $http.post('/auth/register', user)
                .then(saveUser)
        }

        function login(user) {
            return $http.post('/auth/login', user)
                .then(saveUser)
        }

        function logout() {
            return $http.get('/auth/logout')
                .then(removeUser)
        }

        function islogged() {
            return $http.get('/auth/islogged');
        }

        function saveUser(data) {
            if (data.data.user) {
                $rootScope.user = data.data.user;
            }
        }

        function removeUser() {
            $rootScope.user = null;
        }
    }
})();
