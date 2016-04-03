(function () {
    angular
        .module('blog')
        .directive('popUpDialog', popUpDialog);

    /**
     * Modal dialog directive
     *
     * "dialog-body" can contain html tags
     *
     * <pop-up-dialog dialog-show="@Boolean"
     *                dialog-title="@String"
     *                dialog-body="@String"
     *                dialog-ok="@Function">
     * </pop-up-dialog>
     */

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

                scope.$watch('dialogOk', function (onConfirmFunc) {
                    ctrl.onConfirm = function () {
                        onConfirmFunc($('.modal-body'));
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

                function toggle(element, value) {
                    if (!!value) {
                        $(element).modal('show');
                    } else {
                        $(element).modal('hide');
                    }
                }
            },
            templateUrl: 'template/popUpDialog.html'
        }
    }
})();
