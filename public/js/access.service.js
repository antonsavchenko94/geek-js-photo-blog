(function() {
    angular
        .module('blog')
        .service('AccessService', AccessService);

    /**
     * set access restrictions(filters) for urls
     * @param AuthService
     * @param $location
     * @param $rootScope
     * @returns {{check: check, setFilter: setFilter, role: {user: (*|isUser), admin: (*|isAdmin)}}}
     * @constructor
     */
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

        /**
         * redirect if user is not allowed to view @param url
         * @param url
         */
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

        /**
         * create access filter
         * @param urlArray set of urls which need to have access restriction, urls may be instanceof RegExp
         * @param role of user, who is allowed to view @param urlArray
         * @param redirectTo string url
         */
        function setFilter(urlArray, role, redirectTo) {
            filters.push({
                url: urlArray,
                allowAccess: role,
                redirectTo: redirectTo
            })
        }

        /**
         * check if @param url has access restrictions
         * @param url
         * @returns filter
         */
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
