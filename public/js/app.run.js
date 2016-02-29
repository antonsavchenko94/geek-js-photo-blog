(function() {
    angular
        .module('blog')
        .run(run);

    function run($rootScope, $location, AccessService, AuthService) {
        //get user on 'app init' (after refresh/tab close)
        if (!$rootScope.user) {
            AuthService.isLogged().then(function(res) {
                $rootScope.user = res.data.user || null;
            });
        }

        //set access params for urls
        var role = AccessService.role;
        AccessService.setFilter(['/user', '/albums', '/settings'], role.user, '/login');
        AccessService.setFilter(['/admin'], role.admin, '/login');

        //check if current user is allowed to view requested url
        //do nothing if allowed, otherwise redirect
        $rootScope.$on('$locationChangeStart', function() {
            AccessService.check($location.path());
        });
    }
})();
