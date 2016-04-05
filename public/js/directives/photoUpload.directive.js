(function(){
    angular
        .module('blog')
        .directive('photoUpload', photoUpload);

    /**
     * <photo-upload albums="[]" after-upload="function"></photo-upload>
     * <photo-upload avatar></photo-upload>
     */
    function photoUpload() {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                albums: '=',
                afterUpload: '=',
                btnText: '@'
            },
            controllerAs: "vm",
            link: function($scope, $elem, $attrs, ctrl) {
                if ($attrs.avatar) {
                    ctrl.isAvatar = true;
                }

                $scope.$watch('vm.albums', function(newValue) {
                    ctrl.setAlbums(newValue);
                });
            },
            controller: function(AlbumsService, $routeParams) {
                var vm = this;
                vm.photos = [];
                vm.albumId = null;
                vm.btnText = vm.btnText || 'images';

                vm.setAlbums = function(albums) {
                    if (albums) {
                        vm._albums = albums.slice(1, albums.length);
                        if (!vm.profileAlbumId) {
                            vm.profileAlbumId = vm.albums[0]._id;
                        }
                    }
                };

                vm.openPhotos = function(photos, errFiles) {
                    vm.photos = AlbumsService.openPhotos(photos, errFiles);

                    if (vm.isAvatar) {
                        vm.photos = [].concat(vm.photos[0]);
                        vm.photos[0].isAvatar = true;
                    }
                };

                vm.uploadPhotos = function(photos, albumId) {
                    if (!albumId) {
                        albumId = vm.profileAlbumId || $routeParams.album_id || null;
                    }

                    AlbumsService.uploadPhotos(photos, albumId).then(function(){
                        if (vm.afterUpload && typeof vm.afterUpload == 'function') {
                            vm.afterUpload();
                        }
                    });
                    vm.photos = [];
                    vm.albumId = null;
                };
            },
            template:
            '<div class="form-inline upload-form">' +
            '   <select ng-if="vm._albums" class="form-control" ng-options="album._id as album.title for album in vm._albums track by album._id" ng-model="vm.albumId">' +
            '       <option value=""> Profile Album </option>' +
            '   </select>' +
            '   <button class="btn btn-success" ngf-select="vm.openPhotos($files, $invalidFiles)" ngf-multiple="true" accept="image/*" ngf-max-height="6000" ngf-max-size="10MB">' +
            '       Select {{ vm.btnText }}' +
            '   </button>' +
            '   <button class="btn btn-success" ng-click="vm.uploadPhotos(vm.photos, vm.albumId)"> Upload {{ vm.btnText }}</button>' +
            '   <div class="well" ng-if="vm.photos.length > 0">' +
            '       <img ngf-src="vm.photos[id]" ng-repeat="(id, photo) in vm.photos"/>' +
            '   </div>' +
            '</div>'
        }
    }
})();
