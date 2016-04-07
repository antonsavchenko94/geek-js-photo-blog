(function () {
    angular
        .module('blog')
        .directive('privacySelect', privacySelect);


    function privacySelect() {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                photo: '='
            },
            controllerAs: "vm",
            link: function (scope, elem, attrs, ctrl) {

            },
            controller: function ($http, $routeParams, $rootScope, PhotoService) {
                var vm = this;

                vm.status = {
                    publ: 'public',
                    priv: 'private',
                    nocom: 'no-comment'
                };
                vm.currentStatus = vm.photo.status;
                vm.privacyEditable = privacyEditable();

                vm.setPrivacy = setPrivacy;

                function setPrivacy (status){
                    vm.photo.status = status;
                    PhotoService.setPrivacy(vm.photo).then(function (status) {
                        vm.currentStatus = status;
                    });
                }

                function privacyEditable(){
                    return !!vm.photo.status  && $routeParams.album_id &&  ($routeParams.username == $rootScope.user.username);
                }

            },
            templateUrl: 'template/privacySelect.html'
        }
    }
})();
