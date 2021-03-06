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
                templateUrl: 'partials/index',
                controller: 'FeedController',
                controllerAs: 'vm'
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
            .when('/user/:username/albums', {
                templateUrl: 'partials/albums',
                controller: "AlbumsController",
                controllerAs: 'vm'
            })
            .when('/user/:username/:album_id', {
                templateUrl: 'partials/album',
                controller: "AlbumController",
                controllerAs: 'vm'
            })
            .when('/user/:username/:album_id/:photo_id', {
                templateUrl: 'partials/photo',
                controller: "PhotoController",
                controllerAs: 'vm'
            })
            .when('/admin', {
                templateUrl: 'partials/admin',
                controller: "AdminController",
                controllerAs: 'vm'
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
            return AuthService.logout().then(function() {
                $location.path('/');
                return $q.reject('logout');
            });
        }
    }
})();
