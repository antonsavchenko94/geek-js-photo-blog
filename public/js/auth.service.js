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
            islogged: islogged,
            role: {
                user: isUser,
                admin: isAdmin
            }
        };

        function register(user) {
            return $http.post('/auth/register', user)
                .then(saveUser)
                .catch(handleError)
        }

        function login(user) {
            return $http.post('/auth/login', user)
                .then(saveUser)
                .catch(handleError)
        }

        function logout() {
            return $http.get('/auth/logout').then(function() {
                    $rootScope.user = null;
                })
        }

        function islogged() {
            return $http.get('/auth/islogged');
        }

        function isUser() {
            return islogged().then(function(data) {
                return data.data.user
            })
        }

        function isAdmin() {
            return islogged().then(function(data) {
                return data.data.user && data.data.user.isAdmin
            })
        }

        function saveUser(data) {
            if (data.data.user) {
                $rootScope.user = data.data.user;
            }
        }

        function handleError(err) {
            return err.data.message;
        }
    }
})();
