(function() {
    angular
        .module('blog')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$http', 'UsersService', 'Pagination'];

    function UsersController($http, UsersService, Pagination) {
        var vm = this;

        vm.currentPage = 1;
        vm.users = [];
        vm.pagesCount = 0;
        vm.paginationList = [];

        vm.getPage = getPage;

        getPage(vm.currentPage);

        function getPage(pageNum){
            Pagination.setGetPageFunc(UsersService.getPage);
            if(pageNum == 'prev'){
                Pagination.getPrevPage().then(function () {
                    setPageData();
                });
            } else if(pageNum == 'next'){
                Pagination.getNextPage().then(function () {
                    setPageData();
                });

            } else {
                Pagination.getPage(pageNum).then(function () {
                    setPageData();
                });
            }
        }

        function setPageData(){
            vm.users = Pagination.getPageItems();
            vm.paginationList = Pagination.getPaginationList();
            vm.currentPage = Pagination.getCurrentPageNum();
        }
    }
})();
