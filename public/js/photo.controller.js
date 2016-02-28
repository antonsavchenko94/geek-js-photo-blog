(function () {
    angular
        .module('blog')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['AlbumsService', '$location', '$http'];

    function PhotoController(PhotoService, $location, $http) {

    }
})();
