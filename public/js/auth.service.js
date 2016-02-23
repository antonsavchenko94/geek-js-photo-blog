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

        //returns promise with server response
        function isLogged() {
            return $http.get('/auth/islogged');
        }

        //returns promise with user if user is logged
        function isUser() {
            return isLogged().then(function(data) {
                return data.data.user
            })
        }

        //returns promise with bool(true) if user is logged and is admin
        function isAdmin() {
            return isLogged().then(function(data) {
                return data.data.user && data.data.user.isAdmin
            })
        }

        //save to $rootScope to have access to user throughout the app
        //(mainly for template ng-show/ng-hide)
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
