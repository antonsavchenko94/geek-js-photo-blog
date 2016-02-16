(function() {
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
                controllerAs: 'vm',
                resolve: {
                    access: requireLogin
                }
            })
            .when('/user/:username', {
                templateUrl: 'partials/profile',
                controller: 'ProfileController',
                controllerAs: 'vm',
                resolve: {
                    access: requireLogin
                }
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                resolve: {
                    access: requireLogin
                }
            })
            .when('/albums', {
                templateUrl: 'partials/albums',
                resolve: {
                    access: requireLogin
                }
            })
            // TODO user album&photo pages
            .when('/user/:username/album/:album_id', {
                templateUrl: 'partials/album'
            })
            .when('/user/:username/album/:album_id/photo/:photo_id', {
                templateUrl: 'partials/photo'
            })
            .otherwise({
                redirectTo: '/'
            });

        /**
         * executes before template render
         * allows render if user is authenticated, otherwise redirects to login page
         * @param $rootScope includes authenticated user
         * @param $q
         * @param $location performs redirects
         * @returns {*}
         */
        function requireLogin($rootScope, $q, $location) {
            return $q(function(resolve, reject) {
                if ($rootScope.user) {
                    resolve()
                } else {
                    $location.path('/login');
                    reject()
                }
            });
        }

        function logout($q, $location, AuthService) {
            return $q(function(resolve, reject) {
                AuthService.logout();
                $location.path('/');
                reject();
            })
        }
    }
})();
