(function() {
    angular
        .module('blog')
        .directive('lazyLoad', LazyLoad);

    LazyLoad.$inject = ['$parse', '$timeout', 'LazyLoadService'];

    function LazyLoad($parse, $timeout, LazyLoadService) {
        return {
            restrict: 'A',
            link: function($scope, $elem, $attr) {
                var loadHandler = $parse($attr.lazyLoad)($scope);
                var padding = 100;
                var timer = null;
                LazyLoadService.refresh();

                function handleTimer() {
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                    timer = $timeout(checkBounds, 500);
                }

                function checkBounds() {
                    timer = null;
                    var rectObject = $elem[0].getBoundingClientRect();
                    if (rectObject.bottom && rectObject.bottom - window.innerHeight <= padding) {
                        $scope.$apply(LazyLoadService.load(loadHandler));
                    }
                }

                $scope.$on('$destroy', function() {
                    $timeout.cancel(timer);
                });

                angular.element(window).bind('scroll', handleTimer);
            }
        }
    }
})();