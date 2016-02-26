(function () {
    angular
        .module('blog')
        .controller('AllAlbumsController', AllAlbumsController)
        .controller('AlbumController', AlbumController);

    AllAlbumsController.$inject = ['AlbumsService', '$location', '$http'];
    AlbumController.$inject = ['AlbumsService', '$location', '$http', '$routeParams', '$rootScope'];



    function AllAlbumsController(AlbumsService, $http) {
        var vm = this;

        vm.albums = [];

        vm.createAlbum = createAlbum;
        /*vm.albums = AlbumsService.getAlbums();
        console.log("contr " + vm.albums);*/

        vm.newAlbum = {/*
            title:      "",
            postedBy:   {},
            photos:    [
                {
                    filename: "",
                    uploaded: null,
                    status: {
                        type: "",
                        default: 'public',
                        enum:['private', 'public', 'no-comment']
                    },
                    view_count: 0//,
                    //pic: {type: String, required: true}
                }
            ],
            created:    null*/
        };

        $http.get('/api/album').then(function (data) {
            vm.albums = data.data.albums;
        });


        function createAlbum() {
            if (vm.newAlbum.title) {
                AlbumsService.createAlbum(vm.newAlbum);
                vm.albums.push(vm.newAlbum);
                vm.newAlbum = {};
            }
        }
    }

    function AlbumController(AlbumsService, $http, $routeParams) {
        var vm = this;

        var albumId = $routeParams.id;
        vm.album = {};
        /*vm.getAlbumByID = getAlbumByID;

        function getAlbumByID (id) {
             //AlbumsService.getAlbumByID(id);
            $http.get('/api/album/' + id).then(function (data) {
                vm.albums = data.data.albums;
            });
        }*/

        vm.msg = "pidoe";

        $http.get('/api/album/' + albumId).then(function (data) {
            vm.album = data.data.album;
            console.log(vm.album);
        });



    }
})();



