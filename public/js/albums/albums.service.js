(function () {
    angular
        .module('blog')
        .service('AlbumsService', AlbumsService);

    AlbumsService.$inject = ['$http', '$rootScope', '$timeout', 'Upload', '$q'];

    function AlbumsService($http, $rootScope, $timeout, Upload, $q) {
        return {
            removeAlbum: removeAlbum,
            editTitle: editTitle,
            createAlbum: createAlbum,
            getAlbumsList: getAlbumsList,
            getAlbumById: getAlbumById,
            getOwnAlbumById: getOwnAlbumById,
            generatePhotoUrls: generatePhotoUrls,
            createProfileAlbum: createProfileAlbum,
            getAllProfileAlbums: getAllProfileAlbums,
            getProfileAlbum: getProfileAlbum,
            getGlobalViews: getGlobalViews
        };
        /**
         * edits album's title
         * @param album
         * @returns promise
         */
        function editTitle(album) {
            return $http.put('/api/album/edit', {album: album}).then(function (data) {
                return data.data.album;
            });
        }

        /**
         * removes album by id
         * @param id
         * @returns promise
         */
        function removeAlbum(id) {
            return $http.delete('/api/album/remove/' + id/*, {id: id}*/).then(function () {
                return true;
            });
        }

        /**
         * creates new album
         * @param album
         */
        function createAlbum(album) {
            var url = album.isProfileAlbum
                ? '/api/shared/createProfileAlbum'
                : '/api/album/createNew';
            album.postedBy = album.postedBy || $rootScope.user;
            $http.post(url, album);
        }

        /**
         * creates main album of the profile
         * @param user
         */
        function createProfileAlbum(user) {
            var album = {
                title: 'Profile Album',
                isProfileAlbum: true,
                postedBy: user
            };
            createAlbum(album);
        }

        /**
         * returns promise with the list of all profile's albums
         * @param username
         * @returns promise
         */
        function getAlbumsList(username) {
            return $http.get('/api/album/getAll/' + username).then(function (data) {
                return data.data.albums;
            });
        }

        /**
         * returns promise with album by id
         * @param id
         * @param param
         * @returns promise
         */
        function getAlbumById(id, param) {
            return $http.get('/api/album/' + id, {params: {loadMore: param}}).then(function (data) {
                return data.data;
            });
        }

        /**
         * returns promise with the album with private photos
         * @param id
         * @param param
         * @returns promise
         */
        function getOwnAlbumById(id, param) {
            return $http.get('/api/album/getOwnById/' + id, {params: {loadMore: param}}).then(function (data) {
                return data.data;
            });
        }

        /**
         * returns promise with all user's profile albums
         * @param param
         * @returns promise
         */
        function getAllProfileAlbums(param) {
            return $http.get('/api/shared/getAllProfileAlbums', {params: {loadMore: param}})
                .then(function (data) {
                    return data.data;
                });
        }

        /**
         * returns promise with profile album by username
         * @param username
         * @param param
         * @returns promise
         */
        function getProfileAlbum(username, param) {
            return $http.get('/api/album/getProfileAlbum/' + username, {params: {loadMore: param}})
                .then(function (data) {
                    return data.data;
                });
        }

        /**
         * returns album with generated urls to photos
         * @param album
         * @returns album
         */
        function generatePhotoUrls(album) {
            album.map(function (photo) {
                var user = album.postedBy && album.postedBy.username
                    ? album.postedBy.username
                    : photo.postedBy.username;
                photo.imageUrl = '/'
                    + user + '/'
                    + photo.album_id + '/'
                    + photo.filename;
                photo.pageUrl = '/user/'
                    + user + '/'
                    + photo.album_id + '/'
                    + photo._id;

                return photo;
            });

            return album;
        }

        /**
         * returns number of all views of user's photos
         * @param albums
         * @returns {*}
         */
        function getGlobalViews(albums) {
            return albums.reduce(function (sum, album) {
                return sum + album.photos.reduce(function (sum, photo) {
                        return sum + photo.view_count;
                    }, 0)
            }, 0);
        }
    }
})();

