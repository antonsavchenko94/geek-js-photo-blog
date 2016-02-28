(function(){
    angular
        .module('blog')
        .service('PhotoService', PhotoService);

    PhotoService.$inject = ['$http', '$rootScope'];

    function PhotoService($http, $rootScope) {
        return {
        };
    }
})();