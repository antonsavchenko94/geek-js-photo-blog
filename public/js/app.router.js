(function() {
    angular
        .module('blog')
        .config(config);

    function config($routeProvider, $locationProvider) {
        // with base(href='/') in html allows not to get /#/ in routes
        $locationProvider.html5Mode(true);
        var role = {
            user: isUser,
            admin: isAdmin
        };

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
                    access: role.user
                }
            })
            .when('/user/:username', {
                templateUrl: 'partials/profile',
                controller: 'ProfileController',
                controllerAs: 'vm',
                resolve: {
                    access: role.user
                }
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                resolve: {
                    access: role.user
                }
            })
            .when('/albums', {
                templateUrl: 'partials/albums',
                resolve: {
                    access: role.user
                }
            })
            // TODO user album&photo pages
            .when('/user/:username/album/:album_id', {
                templateUrl: 'partials/album'
            })
            .when('/user/:username/album/:album_id/photo/:photo_id', {
                templateUrl: 'partials/photo'
            })
            .when('/admin', {
                templateUrl: 'partials/admin',
                resolve: {
                    access: role.admin
                }
            })
            .otherwise({
                redirectTo: '/'
            });

        /**
         * executes before template render
         * allows render if condition is true, otherwise redirects to login page
         * @param condition
         * @param $q returns promise
         * @param $location performs redirects
         * @returns {*}
         */
        function checkRole(condition, $q, $location) {
            return $q(function(resolve, reject) {
                if (condition) {
                    resolve()
                } else {
                    $location.path('/login');
                    reject()
                }
            });
        }

        function isUser($q, $location, AuthService) {
            return AuthService.islogged().then(function(data) {
                    return checkRole(data.data.user, $q, $location)
                })
        }

        function isAdmin($q, $location, AuthService) {
            return AuthService.islogged().then(function(data) {
                return checkRole(data.data.user.isAdmin, $q, $location)
            })
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
