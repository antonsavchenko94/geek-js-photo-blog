(function () {
    angular
        .module('blog')
        .service('UsersService', UsersService);

    UsersService.$inject = ['$http', '$rootScope', '$timeout', 'Upload', '$q'];

    function UsersService($http, $rootScope, $timeout, Upload, $q) {
        return {
            getPage: getPage
        };

        function getPage(pageNumber){
            return $http.get('/api/users/page/' + pageNumber).then(function (data) {
                return data.data;
            })
        }


    }
})();

