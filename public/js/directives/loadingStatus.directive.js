(function() {
    angular
        .module('blog')
        .directive('ifLoading', ifLoading);
    ifLoading.$inject = ['$http'];

    function ifLoading($http) {
        return {
            restrict: 'A',
            link: function($scope) {
                $scope.isLoading = isLoading;

                $scope.$watch($scope.isLoading, toggleElement);

                function toggleElement(loading) {
                    $scope.show = !!loading;
                }

                function isLoading() {
                    return $http.pendingRequests.length > 0;
                }
            },
            template:"<img ng-show='show' src='/images/cat-load.gif' class='load-status'/>"
        };
    }

}());