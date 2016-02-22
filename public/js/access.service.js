(function() {
    angular
        .module('blog')
        .factory('AccessService', AccessService);

    function AccessService (AuthService, $location, $rootScope) {
        var role = {
            user: AuthService.role.user,
            admin: AuthService.role.admin
        };
        var filters = [];
        
        return {
            check: check,
            setFilter: setFilter,
            role: role
        };

        //redirect if user is not allowed to view @param url
        function check(url) {
            var filter = getFilter(url);

            if (filter) {
                filter.allowAccess().then(function(allow) {
                    if (!allow) {
                        $location.path($rootScope.user ? '/' : filter.redirectTo);
                    }
                });
            }
        }

        function setFilter(urlArray, role, redirectTo) {
            filters.push({
                url: urlArray,
                allowAccess: role,
                redirectTo: redirectTo
            })
        }

        //check if @param url has access restrictions
        function getFilter(url) {
            for (var i = 0; i < filters.length; i++) {
                for (var j = 0; j < filters[i].url.length; j++) {
                    if (compareUrls(url, filters[i].url[j])) {
                        return filters[i];
                    }
                }
            }
        }

        function compareUrls(requestedUrl, filterUrl) {
            return new RegExp(filterUrl).test(requestedUrl);
        }
    }
})();
