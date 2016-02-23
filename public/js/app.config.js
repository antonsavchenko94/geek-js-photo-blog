(function () {
    angular
        .module('blog')
        .config(config);

    function config($routeProvider, $locationProvider) {
        // with base(href='/') in html allows not to get /#/ in routes
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'partials/index'
            })
            .when('/register', {
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
                templateUrl: 'partials/settings'
            })
            .when('/albums', {
                templateUrl: 'partials/albums'
            })
            // TODO user album&photo pages
            .when('/user/:username/album/:album_id', {
                templateUrl: 'partials/album'
            })
            .when('/user/:username/album/:album_id/photo/:photo_id', {
                templateUrl: 'partials/photo'
            })
            .when('/admin', {
                templateUrl: 'partials/admin'
            })
            .otherwise({
                redirectTo: '/'
            });

        function logout($q, $location, AuthService) {
            return $q(function (resolve, reject) {
                AuthService.logout();
                $location.path('/');
                reject();
            })
        }
    }
})();
