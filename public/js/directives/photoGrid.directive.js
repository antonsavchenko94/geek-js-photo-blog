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
            scope: {
                select: '=',
                orderBy: '='
            },
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
            template: '' +
            '<div class="photogrid-item col-sm-6 col-xs-12 col-md-4 col-lg-3" ng-class="{hasTitle: photo.title}" ng-repeat="photo in vm.photos">' +
            '   <div class="input-group" ng-if="photo.editable "> ' +
            '       <input type="text" class="form-control" placeholder="Enter {{photo.title}}\'s new title..." ng-model="photo.newTitle"> ' +
            '       <div class="input-group-btn"> ' +
            '           <button type="button" class="btn btn-default" ng-click="vm.editTitle(photo)">' +
            '               <span class="glyphicon glyphicon-pencil"></span>' +
            '           </button> ' +
            '           <button type="button" class="btn btn-primary" ng-click="vm.removeAlbum(photo)">' +
            '               <span class="glyphicon glyphicon-remove"></span>' +
            '           </button> ' +
            '       </div> ' +
            '   </div>' +
            '   <privacy-select photo="photo" ng-if="photo.status"></privacy-select>' +
            '   <a class="thumbnail" href="{{photo.pageUrl}}">' +
            '       <h2 ng-if="photo.title" class="text-center">{{photo.title}}</h2>' +
            '       <div class="img-container">' +
            '           <img class="img-responsive" src="{{photo.imageUrl}}"/>' +

            '       </div>' +
            '   </a>' +
            '</div>' +
            '<pop-up-dialog dialog-show="vm.dialogVisible" ' +
            '               dialog-title="vm.dialog.title" ' +
            '               dialog-body="vm.dialog.body" ' +
            '               dialog-ok="vm.dialog.onConfirm">' +
            '</pop-up-dialog>'

        };
    }
})();