(function() {
    angular
        .module('blog')
        .run(run);

    function run($rootScope, $location, AccessService) {
        var role = AccessService.role;
        //set access params for urls
        AccessService.setFilter(['/user*', '/albums*', '/settings*'], role.user, '/login');
        AccessService.setFilter(['/admin*'], role.admin, '/login');

        //check if current user is allowed to view requested url
        $rootScope.$on('$locationChangeStart', function() {
            AccessService.check($location.path());
        });
    }
})();
