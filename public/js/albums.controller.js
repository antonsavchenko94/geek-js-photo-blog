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

        vm.newAlbum = {
            /*
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

        function createAlbum(title) {
            if (title) {
                AlbumsService.createAlbum({title: title});
                $http.get('/api/album').then(function (data) {
                    vm.albums = data.data.albums;
                });
                vm.newAlbum = {};
            }
        }
    }

    function AlbumController(AlbumsService, $location, $http, $routeParams) {
        var vm = this;

        var albumId = $routeParams.id;
        vm.title = "";
        vm.album = {};
        vm.photos = [];
        vm.image = {
            filename: ""
        };

        vm.openPhotos = openPhotos;
        vm.uploadPhotos = uploadPhotos;
        vm.getPhoto = getPhoto;
        vm.getPhotoUrl = getPhotoUrl;

        vm.msg = "";

        $http.get('/api/album/' + albumId).then(function (data) {
            vm.album = data.data.album;
            console.log(vm.album);
        });

        function openPhotos(photos, errFiles) {
            console.log(photos);
            if (photos && !photos.length) {
                vm.photos = [photos];
            } else {
                vm.photos = photos;
            }
        }

        function uploadPhotos(photos) {

            AlbumsService.uploadPhotos(photos, getAlbumId());
        }

        function getPhoto() {
            $http.get('/api/album/getPhoto/' + albumId)
                .then(function (data) {
                    console.log(data);
                    //vm.album.push(data.data.photo);
                    //console.log(vm.album);
                })
        }

        function getPhotoUrl(filename) {
            if (vm.album) {
                return "/assets/"
                    + vm.album.postedBy.username + "/"
                    + vm.album._id + "/"
                    + filename;
            }
        }

        function getAlbumId() {
            var path = $location.path().split("/");
            return path[path.length - 1];
        }

    }
})();