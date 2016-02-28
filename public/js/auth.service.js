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
            isLogged: isLogged,
            role: {
                user: isUser,
                admin: isAdmin
            }
        };

        function register(user, successCb, failureCb) {
            return $http.post('/api/auth/register', user)
                .then(successCb)
                .catch(failureCb)
        }

        function login(user, successCb, failureCb) {
            return $http.post('/api/auth/login', user)
                .then(successCb)
                .catch(failureCb)
        }

        function logout() {
            return $http.get('/api/auth/logout').then(function() {
                    $rootScope.user = null;
                })
        }

        /**
         * check if current visitor is logged
         * @returns HttpPromise
         */
        function isLogged() {
            return $http.get('/api/auth/islogged');
        }

        /**
         * check if current visitor is authenticated user
         * @returns Promise
         */
        function isUser() {
            return isLogged().then(function(res) {
                return res.data.user;
            })
        }

        /**
         * check if user is logged and is admin
         * @returns Promise
         */
        function isAdmin() {
            return isLogged().then(function(res) {
                return res.data.user && res.data.user.isAdmin;
            })
        }
    }
})();
