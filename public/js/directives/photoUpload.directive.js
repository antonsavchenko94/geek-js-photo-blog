(function(){
    angular
        .module('blog')
        .directive('photoUpload', photoUpload);

    /**
     * requires ng-if to run directive only when *some_value* is available
     * <photo-upload albums="some_value" ng-if="some_value" after-upload="function"></photo-upload>
     */
    function photoUpload() {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                albums: '=',
                afterUpload: '='
            },
            controllerAs: "vm",
            link: function($scope, $elem, $attrs, ctrl) {
                $scope.$watch('vm.albums', function(newValue) {
                    ctrl.setAlbums(newValue);
                });
            },
            controller: function(AlbumsService, $routeParams) {
                var vm = this;
                vm.photos = [];
                vm.albumId = null;
                if (vm.albums) {
                    vm.profileAlbumId = vm.albums[0]._id;
                }

                vm.setAlbums = function(albums) {
                    if(albums) {
                        vm._albums = albums.slice(1, vm.albums.length);
                    }
                };

                vm.openPhotos = function(photos, errFiles) {
                    vm.photos = AlbumsService.openPhotos(photos, errFiles);
                };

                vm.uploadPhotos = function(photos, albumId) {
                    if (!albumId) {
                        albumId = vm.profileAlbumId || $routeParams.album_id;
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
            '   <button class="btn btn-success" ngf-select="vm.openPhotos($files, $invalidFiles)" ngf-multiple="true" accept="image/*" ngf-max-height="1000" ngf-max-size="1MB">' +
            '       Select images ' +
            '   </button>' +
            '   <button class="btn btn-success" ng-click="vm.uploadPhotos(vm.photos, vm.albumId)"> Upload images</button>' +
            '   <div class="well" ng-if="vm.photos.length > 0">' +
            '       <div ng-repeat="(id, photo) in vm.photos">' +
            '           <img ngf-src="vm.photos[id]" />' +
            '       </div>' +
            '   </div>' +
            '</div>'
        }
    }
})();
