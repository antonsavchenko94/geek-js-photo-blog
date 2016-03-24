(function() {
    angular
        .module('blog')
        .directive('lazyLoad', LazyLoad);

    LazyLoad.$inject = ['$parse', '$timeout'];

    function LazyLoad($parse, $timeout) {
        return {
            restrict: 'A',
            link: function($scope, $elem, $attr) {
                var loadHandler = $parse($attr.lazyLoad);
                var padding = 100;
                var timer = null;

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
                        $scope.$apply(loadHandler($scope));
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