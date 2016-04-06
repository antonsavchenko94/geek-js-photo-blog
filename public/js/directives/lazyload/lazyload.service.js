(function() {
    angular
       .module('blog')
       .service('LazyLoadService', LazyLoadService);

    LazyLoadService.$inject = ['$q'];

    function LazyLoadService($q) {
        var noMoreData;
        var requestParam;
        refresh();

        return {
            load: load,
            refresh: refresh
        };

        function refresh() {
            noMoreData = false;
            requestParam = 'more';
        }

        function load(cb) {
            console.log(noMoreData);
            if (!noMoreData) {
                return cb(requestParam).then(function(res) {
                    noMoreData = res.noMoreData;
                    return $q.resolve(res);
                });
            } else {
                return $q.reject('no more data');
            }
        }
    }
})();