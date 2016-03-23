(function(){
    angular
        .module('blog')
        .directive('flashMessage', flashMessage);

    function flashMessage() {
        return {
            restrict: 'E',
            template: '<div ng-if="message" class="alert alert-{{message.type}}"> {{message.text}} </div>'
        }
    }
})();