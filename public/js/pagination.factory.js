(function () {
    angular
        .module('blog')
        .factory('Pagination', Pagination);

    Pagination.$inject = ['$sce'];

    function Pagination($sce) {

        //set maximum pages in pagination
        var shownPagesLimit = 5;

        var currentPage = 0;
        var items = [];
        var totalItems = 0;
        var totalPages = 0;
        var getPage = function () {
            return null
        };

        var getPaginationRange = function () {
            var startPage, endPage;
            if(totalPages <= shownPagesLimit){
                startPage = 1;
                endPage = totalPages;
            } else {
                if (currentPage <= Math.ceil(shownPagesLimit / 2)) {
                    startPage = 1;
                    endPage = shownPagesLimit;
                } else if (currentPage + 1 >= totalPages) {
                    startPage = totalPages - Math.ceil(shownPagesLimit / 2) - 1;
                    endPage = totalPages;
                } else {
                    var sidePages = Math.floor(shownPagesLimit / 2);
                    startPage = currentPage - sidePages;
                    endPage = currentPage + sidePages;
                }
            }
            return ({startPage: startPage, endPage: endPage})
        };

        return {

            setGetPageFunc: function (getPageFunction) {
                getPage = getPageFunction;
            },

            getPageItems: function () {
                return items;
            },

            getTotalItems: function () {
                return totalItems;
            },

            getTotalPages: function () {
                return totalPages;
            },

            getPage: function (num) {
                return getPage(num).then(function (data) {
                    items = data.users;
                    totalItems = data.usersCount;
                    totalPages = data.pagesCount;
                    currentPage = num;
                    return data;
                });
            },

            getPaginationList: function () {

                var range = getPaginationRange();
                var paginationList = [];

                paginationList.push({
                    name: $sce.trustAsHtml('&laquo;'),
                    link: 'prev'
                });

                for (var i = range.startPage; i <= range.endPage; i++) {
                    paginationList.push({
                        name: $sce.trustAsHtml(String(i)),
                        link: i
                    });
                }

                paginationList.push({
                    name: $sce.trustAsHtml('&raquo;'),
                    link: 'next'
                });

                if (paginationList.length > 3) {
                    return paginationList;
                } else {
                    return null;
                }
            },

            getPrevPage: function () {
                var prevPageNum = currentPage - 1;
                if (prevPageNum <= 0) prevPageNum = 1;
                return this.getPage(prevPageNum);
            },

            getNextPage: function () {
                console.log('next');
                var nextPageNum = currentPage + 1;
                var pagesNum = totalPages;
                if (nextPageNum > pagesNum) nextPageNum = pagesNum;
                return this.getPage(nextPageNum);
            },

            getCurrentPageNum: function () {
                return currentPage;
            }

        }
    }
})();

