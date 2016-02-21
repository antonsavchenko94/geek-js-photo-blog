(function(){
    angular
        .module('blog')
        .service('AlbumsService', AlbumsService);

    AlbumsService.$inject = ['$http', '$rootScope'];

    function AlbumsService($http, $rootScope) {

    }
})();

