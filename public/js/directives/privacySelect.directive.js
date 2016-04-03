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
            controller: function ($http, $routeParams, $rootScope) {
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
                    console.log(vm.photo);
                    $http.post('/api/album/updatePhotoPrivacy', {photo: vm.photo}).then(function (data) {
                        vm.currentStatus = data.data.photo.status;
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
