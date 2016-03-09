(function(){
    angular
        .module('blog')
        .directive('flashMessage', flashMessage)
        .directive('photoGrid', photoGrid);

    function flashMessage() {
        return {
            restrict: 'E',
            template: '<div ng-if="message" class="alert alert-{{message.type}}"> {{message.text}} </div>'
        }
    }

    function photoGrid() {
        return {
            restrict: 'E',
            scope: {
                photos: '=',
                select: '=',
                orderBy: '='
            },
            template:
                '<div class="photogrid-item col-sm-6 col-xs-12 col-md-4 col-lg-3" ng-repeat="photo in photos">' +
                '   <a class="thumbnail" href="{{photo.pageUrl}}">' +
                '       <img class="img-responsive" src="{{photo.url}}"/>' +
                '   </a>' +
                '</div>'
        };
    }
})();