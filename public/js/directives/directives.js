(function(){
    angular
        .module('blog')
        .directive('flashMessage', flashMessage)
        .directive('photoGrid', photoGrid);

    function flashMessage() {
        return {
            restrict: 'E',
            template: '<div ng-if="message" class="alert alert-{{message.type}}"> {{message.text}} </div>'
        }
    }

    function photoGrid() {
        return {
            restrict: 'E',
            scope: {
                photos: '=',
                select: '=',
                orderBy: '='
            },
            controllerAs: "vm",
            controller: function (AlbumsService) {
                var vm = this;

                vm.dialogVisible = false;
                vm.dialog = {
                    title: 'default',
                    body: 'default',
                    visible: false,
                    onConfirm: function () {
                    }
                };

                vm.removeAlbum  = removeAlbum;
                vm.editTitle = editTitle;

                function removeAlbum(album){
                    vm.dialog = {
                        title: 'Removing album',
                        body: '<h1>Album \''+ album.title +'\' will be removed</h1>',
                        onConfirm: function () {
                            AlbumsService.removeAlbum(album.albumId);
                        }
                    };
                    vm.dialogVisible = true;
                }

                function editTitle(data){
                    data.newTitle = 'new';
                    vm.dialog = {
                        title: 'Edit title',
                        body: '' +
                        '<p>Old title: </p>' + data.title +
                        '<span ng-bind="data.title()"></span>' +
                        '<br>' +
                        '<input type="text" name="newTitle" placeholder="Enter new title..." ' +
                                'ng-model="data.title" ng-model-options="{getterSetter: true}">',
                        onConfirm: function () {
                            console.log('editing album' + data.title + '\nnew title: ' + data.newTitle)
                        }
                    };
                    vm.dialogVisible = true;
                }

            },
            template:
                '<div class="photogrid-item col-sm-6 col-xs-12 col-md-4 col-lg-3" ng-class="{hasTitle: photo.title}" ng-repeat="photo in photos">' +
                '       <div ng-if="photo.editable">' +
                '           <button ng-click="vm.editTitle(photo)">Edit title</button>' +
                '           <button ng-click="vm.removeAlbum(photo)">Remove</button>' +
                '       </div>' +
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