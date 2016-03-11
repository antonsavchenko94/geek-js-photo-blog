(function () {
    angular
        .module('blog')
        .config(config);

    function config($routeProvider, $locationProvider, $httpProvider) {
        // with base(href='/') in html allows not to get /#/ in routes
        $locationProvider.html5Mode(true);
        // run MessageInterceptor function on each server response
        $httpProvider.interceptors.push('MessageInterceptor');

        $routeProvider
            .when('/', {
                templateUrl: 'partials/index'
            })
            .when('/register', {
                templateUrl: 'partials/register',
                controller: 'AuthController',
                controllerAs: 'vm'
            })
            .when('/register/:token', {
                templateUrl: 'partials/register',
                controller: 'AuthController',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'AuthController',
                controllerAs: 'vm'
            })
            .when('/logout', {
                resolve: {
                    logout: logout
                }
            })
            .when('/user', {
                templateUrl: 'partials/users',
                controller: 'UsersController',
                controllerAs: 'vm'
            })
            .when('/user/:username', {
                templateUrl: 'partials/profile',
                controller: 'ProfileController',
                controllerAs: 'vm'
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                controller: 'ProfileController',
                controllerAs: 'vm'
            })
            .when('/albums', {
                templateUrl: 'partials/albums'
            })
            .when('/admin', {
                templateUrl: 'partials/admin'
            })
            .otherwise({
                redirectTo: '/'
            });

        /**
         * reject template render and redirect
         * @param $q
         * @param $location
         * @param AuthService
         * @returns Promise.reject
         */
        function logout($q, $location, AuthService) {
            return $q(function (resolve, reject) {
                AuthService.logout();
                $location.path('/');
                reject();
            })
        }
    }
})();
