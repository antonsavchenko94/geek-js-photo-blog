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
            controller: function(AlbumsService, $routeParams, $rootScope) {
                var vm = this;
                vm.photos = [];
                vm.albumId = null;
                vm.btnText = vm.btnText || 'images';
                vm.baned = $rootScope.user.status == 'baned';

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
            templateUrl: 'template/photoUpload.html'
        }
    }
})();
