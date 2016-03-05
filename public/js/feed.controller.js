(function () {
    angular
        .module('blog')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['AlbumsService', '$location', '$http', '$routeParams'];

    function FeedController(AlbumsService, $location, $http, $routeParams) {
        var vm = this;

        vm.msg = '';



    }
})();

