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
            bindToController:{
                refresh: '=',
                photos: '='
            },
            scope: {},
            controllerAs: "vm",
            link: function($scope, $elem, $attr, ctrl) {
                $scope.$watch('vm.photos', function(photos) {
                    if (photos) {
                        ctrl.photos = photos;
                    }
                })
            },
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
                            AlbumsService.removeAlbum(album.albumId).then(function () {
                                vm.refresh();
                            });
                        }
                    };
                    vm.dialogVisible = true;
                }

                function editTitle(data){

                    vm.dialog = {
                        title: 'Edit album\'s title',
                        body: '' +
                        '<p>Old title: ' + data.title + ' </p> ' +
                        '<p>New title: ' + data.newTitle + ' </p> ',
                        onConfirm: function () {
                            AlbumsService.editTitle({id: data.albumId, title: data.newTitle}).then(function () {
                                vm.refresh();
                            });
                        }
                    };
                    vm.dialogVisible = true;
                    /*vm.dialog = {
                        title: 'Edit album\'s title',
                        body: '' +
                        '<p>Old title: '+ data.title +' </p> ' +
                        '<span ng-init="newTitle=0">{{ newTitle }}</span>' +
                        '<br>' +
                        '<input id="new-title" value="000" type="text" placeholder="Enter new title..." ' +
                                'ng-model="newTitle">',
                        onConfirm: function (body) {
                            console.log(body);
                            //console.log('editing album: ' + data.title + '\nnew title: ' + newTitle)
                        }
                    };
                    vm.dialogVisible = true;*/
                }
            },
            template:
                '<div class="photogrid-item col-sm-6 col-xs-12 col-md-4 col-lg-3" ng-class="{hasTitle: photo.title}" ng-repeat="photo in vm.photos">' +
                '   <div ng-if="photo.editable">' +
                '       <div class="input-group"> ' +
                '           <input type="text" class="form-control" placeholder="Enter {{photo.title}}\'s new title..." ng-model="photo.newTitle"> ' +
                '           <div class="input-group-btn"> ' +
                '               <button type="button" class="btn btn-default" ng-click="vm.editTitle(photo)">' +
                '                   <span class="glyphicon glyphicon-pencil"></span> Apply title' +
                '               </button> ' +
                '               <button type="button" class="btn btn-primary" ng-click="vm.removeAlbum(photo)">' +
                '                   <span class="glyphicon glyphicon-remove"></span> Remove album' +
                '               </button> ' +
                '           </div> ' +
                '       </div>' +
                '   </div>' +

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