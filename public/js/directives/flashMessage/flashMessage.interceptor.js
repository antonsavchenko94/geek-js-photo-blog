(function(){
    angular
        .module('blog')
        .service('MessageInterceptor', MessageInterceptor);

    MessageInterceptor.$inject = ['$q', 'FlashMessage'];

    function MessageInterceptor($q, FlashMessage) {
        return {
            response: function(response) {
                createMessage(FlashMessage.TYPE.SUCCESS, response);

                return response;
            },
            responseError: function(response) {
                createMessage(FlashMessage.TYPE.DANGER, response);

                return $q.reject(response);
            }
        };

        function createMessage(type, response) {
            (response.data && response.data.message)
                ? FlashMessage.create(type, response.data.message)
                : FlashMessage.remove();
        }
    }
})();