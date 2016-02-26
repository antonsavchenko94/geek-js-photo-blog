(function () {
    angular
        .module('blog')
        .service('AlbumsService', AlbumsService);

    AlbumsService.$inject = ['$http', '$rootScope'];

    function AlbumsService($http, $rootScope) {
        return {
            createAlbum: createAlbum,
            getAlbums: getAlbums,
            getAlbumById: getAlbumById
        };

        function createAlbum(album) {
            album.postedBy = $rootScope.user;
            $http.post('/api/album', album);
        }

        function getAlbums() {
            var albums = null;
            console.log(albums);

            $http.get.call('/api/album')
                .then(function (data) {
                    albums = data.data.albums;
                    console.log(albums);
                });
            console.log(albums);
            return albums;
        }

        function getAlbumById(id) {

        }
    }
})();

