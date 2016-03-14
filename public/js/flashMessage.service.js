(function(){
    angular
        .module('blog')
        .factory('MessageInterceptor', MessageInterceptor);

    MessageInterceptor.$inject = ['$q', '$rootScope'];

    function MessageInterceptor($q, $rootScope) {
        return {
            response: function(response) {
                $rootScope.message = response.data.message ? {type: 'success', text: response.data.message} : null;
                return response;
            },
            responseError: function(error) {
                $rootScope.message = error.data.message ? {type: 'danger', text: error.data.message} : null;
                return $q.reject(error);
            }
        }
    }
})();
