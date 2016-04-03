(function () {
    angular
        .module('blog')
        .directive('photoGrid', photoGrid);

    function photoGrid() {
        return {
            restrict: 'E',
            bindToController: {
                refresh: '=',
                album: '=',
                photos: '='
            },
            scope: {},
            controllerAs: "vm",
            controller: function (AlbumsService) {
                var vm = this;

                if(vm.album){
                    vm.photos = vm.album.photos;
                }

                vm.dialogVisible = false;
                vm.dialog = {
                    title: 'default',
                    body: 'default',
                    visible: false,
                    onConfirm: function () {
                    }
                };

                vm.isVisible = isVisible();

                vm.removeAlbum = removeAlbum;
                vm.editTitle = editTitle;

                function removeAlbum(album) {

                    vm.dialog = {
                        title: 'Removing album',
                        body: '<h1>Album \'' + album.title + '\' will be removed</h1>',
                        onConfirm: function () {
                            AlbumsService.removeAlbum(album.albumId).then(function () {
                                vm.refresh();
                            });
                        }
                    };
                    vm.dialogVisible = true;
                }

                function editTitle(data) {

                    vm.dialog = {
                        title: 'Edit album\'s title',
                        body: '' +
                        '<p>Old title: ' + data.title + ' </p> ' +
                        '<p>New title: ' + data.newTitle + ' </p> ',
                        onConfirm: function () {
                            if (data.newTitle) {
                                AlbumsService.editTitle({id: data.albumId, title: data.newTitle}).then(function () {
                                    vm.refresh();
                                });
                            }
                        }
                    };
                    vm.dialogVisible = true;
                }

                function isVisible(){
                    return false;
                }
            },
            templateUrl: 'template/photoGrid.html'
        };
    }
})();