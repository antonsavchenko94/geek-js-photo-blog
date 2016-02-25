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
            saveUser: saveUser,
            role: {
                user: isUser,
                admin: isAdmin
            }
        };

        function register(user) {
            return $http.post('/api/auth/register', user)
                .then(saveUser)
                .catch(handleError)
        }

        function login(user) {
            return $http.post('/api/auth/login', user)
                .then(saveUser)
                .catch(handleError)
        }

        function logout() {
            return $http.get('/api/auth/logout').then(function() {
                    $rootScope.user = null;
                })
        }

        /**
         * check if current visitor is logged
         * @returns Promise
         */
        function isLogged() {
            return $http.get('/api/auth/islogged');
        }

        /**
         * check if current visitor is authenticated user
         * @returns Promise
         */
        function isUser() {
            return isLogged().then(function(data) {
                return data.data.user
            })
        }

        /**
         * check if user is logged and is admin
         * @returns Promise
         */
        function isAdmin() {
            return isLogged().then(function(data) {
                return data.data.user && data.data.user.isAdmin
            })
        }

        /**
         * save to $rootScope to have access to user throughout the app
         * (mainly for template ng-show/ng-hide)
         * @param data server response with user object
         */
        function saveUser(data) {
            if (data.data.user) {
                $rootScope.user = data.data.user;
            }
        }

        function handleError(err) {
            if (err.data.message) {
                return err.data.message;
            }
        }
    }
})();
