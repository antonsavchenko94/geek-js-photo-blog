(function() {
    angular
        .module('blog')
        .controller('AlbumsController', AlbumsController);

    AlbumsController.$inject = ['AlbumsService', '$location'];

    function AlbumsController(AlbumsService, $location) {

    }
})();
