(function(){
    angular
        .module('blog')
        .directive('privacySelect', privacySelect);


    function privacySelect() {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {

            },
            controllerAs: "vm",
            link: function($scope, $elem, $attrs, ctrl) {

            },
            controller: function(AlbumsService, $routeParams) {
            },
            template: '' +
            '   <div class="btn-group" data-toggle="buttons">' +
            '       <label class="btn btn-primary active">' +
            '           <input type="radio" name="options" id="option1"> Параметр 1' +
            '       </label>' +
            '       <label class="btn btn-primary">' +
            '           <input type="radio" name="options" id="option2"> Параметр 2' +
            '       </label>' +
            '       <label class="btn btn-primary">' +
            '          <input type="radio" name="options" id="option3"> Параметр 3' +
            '        </label>' +
            '   </div> '
        }
    }
})();
