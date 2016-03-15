(function(){
    angular
        .module('blog')
        .service('AuthService', AuthService);

    AuthService.$inject = ['$http', '$rootScope', '$routeParams'];

    function AuthService($http, $rootScope, $routeParams) {
        return {
            register: register,
            login: login,
            logout: logout,
            isLogged: isLogged,
            sendToken:sendToken,
            checkToken:checkToken,
            newPassword:newPassword,
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

        function sendToken(email) {
            return $http.post('/api/token/'+email);
        }
        function checkToken(successCb,failureCb){
            if (!$routeParams.token) return;
            return $http.post('/api/token/check'+$routeParams.token)
                .then(successCb)
                .catch(failureCb);
        }

        function newPassword(email, successCb, failureCb){
            return $http.post('/api/auth/recovery',{'email': email})
                .then(successCb)
                .catch(failureCb);
        }
    }
})();
