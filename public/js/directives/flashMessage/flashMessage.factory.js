(function(){
    angular
        .module('blog')
        .factory('FlashMessage', FlashMessage);

    FlashMessage.$inject = ['$rootScope'];

    function FlashMessage($rootScope) {
        var TYPE = {
            SUCCESS: 'success',
            INFO: 'info',
            WARNING: 'warning',
            DANGER: 'danger'
        };

        return {
            create: create,
            remove: remove,
            TYPE: TYPE
        };

        /**
         * @param type ['success', 'info', 'warning', 'danger']
         * @param text
         */
        function create(type, text) {
            $rootScope.message = {type: type, text: text};
        }

        function remove() {
            $rootScope.message = null;
        }
    }

})();