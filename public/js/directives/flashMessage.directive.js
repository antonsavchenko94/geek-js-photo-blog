(function(){
    angular
        .module('blog')
        .service('MessageInterceptor', MessageInterceptor)
        .directive('flashMessage', flashMessage);

    function flashMessage() {
        return {
            restrict: 'E',
            template: '<div ng-if="message" class="alert alert-{{message.type}}"> {{message.text}} </div>'
        }
    }

    MessageInterceptor.$inject = ['$q', '$rootScope'];

    function MessageInterceptor($q, $rootScope) {
        return {
            response: function(response) {
                $rootScope.message = response.data && response.data.message
                    ? {type: 'success', text: response.data.message}
                    : null;
                return response;
            },
            responseError: function(error) {
                $rootScope.message = error.data && error.data.message
                    ? {type: 'danger', text: error.data.message}
                    : null;
                return $q.reject(error);
            }
        }
    }
})();