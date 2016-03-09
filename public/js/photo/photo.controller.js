(function () {
    angular
        .module('blog')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['AlbumsService', '$location', '$http', '$routeParams', '$rootScope'];

    function PhotoController(AlbumsService, $location, $http, $routeParams, $rootScope) {
        var vm = this;

    }
})();
