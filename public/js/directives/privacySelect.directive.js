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
            template: '' +
            '<div class="dropdown" ng-if="vm.privacyEditable">' +
            '   <button class="btn btn-xs btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
            '    {{vm.currentStatus}}' +
            '   <span class="caret"></span>' +
            '   </button>' +
            '   <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
            '       <li><a ng-click="vm.setPrivacy(vm.status.publ)">Public</a></li>' +
            '       <li><a ng-click="vm.setPrivacy(vm.status.priv)">Private</a></li>' +
            '       <li><a ng-click="vm.setPrivacy(vm.status.nocom)">Off comments</a></li>' +
            '   </ul>' +
            '</div>'
        }
    }
})();
