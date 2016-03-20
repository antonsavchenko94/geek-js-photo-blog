(function () {
    angular
        .module('blog')
        .directive('popUpDialog', popUpDialog);

    function popUpDialog() {
        return {
            restrict: 'E',
            scope: {
                dialogOk: '='
            },
            bindToController: {
                dialogTitle: '=',
                dialogBody: '=',
                dialogShow: '='
            },
            transclude: true,
            replace: true,
            controllerAs: "vm",
            link: function postLink(scope, element, attrs, ctrl) {

                scope.$watch('dialogOk', function (value) {
                    ctrl.onConfirm = function () {
                        value();
                        ctrl.toggle(element);
                    }
                });

                scope.$watch('vm.dialogShow', function (value) {
                    ctrl.toggle(element, value);
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                        ctrl.dialogShow = false;
                    });
                });

                scope.$watch('vm.dialogTitle', function (value) {

                    ctrl.title = value;
                });
                scope.$watch('vm.dialogBody', function (value) {
                    $('.modal-body').html(value);
                });


            },
            controller: function ($scope) {
                var vm = this;

                vm.title = '';
                vm.body = '';
                vm.onConfirm = $scope.dialogOk;

                vm.toggle = toggle;
                vm.hasHtml = hasHtml;

                function hasHtml(str) {
                    var res = str.match( /[<\/][a-zA-Z]{1,7}[>]+/ );
                    console.log(res);
                    return null;
                }

                function hide() {
                    vm.dialogShow = false;
                }

                function toggle(element, value) {
                    if (!!value) {
                        $(element).modal('show');
                    } else {
                        $(element).modal('hide');
                    }
                }
            },
            template: '' +
            '<div class="modal fade">' +
            '   <div class="modal-dialog">' +
            '       <div class="modal-content">' +
            '           <div  class="modal-header">' +
            '               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '               <h4 id="dialog-title" class="modal-title">{{ vm.title }}</h4>' +
            '           </div>' +
            '           <div id="dialog-body" class="modal-body">' +
            '               <p>{{ vm.body }}</p>' +
            '           </div>' +
            '           <div class="modal-footer">' +
            '               <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
            '               <button type="button" class="btn btn-primary" ng-click="vm.onConfirm()">Confirm</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        }
    }
})();
