(function () {
    angular
        .module('blog')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', 'User', '$rootScope'];

    function AdminController(User, $rootScope, $http) {
        var vm = this;

        getUsers();
        getComplainPhotos();
        /**
         * Delete User by id
         * @param id
         */
        vm.delete = function (id) {
            vm.dialog = {
                title: 'Deleting user',
                body: '<h1>User with  ID \''+ id +'\' will be deleted</h1>',
                onConfirm: function () {
                    User.delete({id: id}, function () {
                        getUsers().$promise.then(function () {
                            showFlashMessage('success', 'User (id = ' + id + ') was successfully deleted.')
                        });
                    })
                }
            };
            vm.dialogVisible = true;
        };
        /**
         * Ban and unban User by id
         * @param id
         */
        vm.ban = function (id) {
            User.getOne({id: id}, function (user) {
                user.status == 'active'
                    ? user.status = 'baned'
                    : user.status = 'active';
                User.update({id: user._id}, {status: user.status}, function () {
                    getUsers().$promise.then(function () {
                        showFlashMessage('info', 'User ' + user.username + ' status: ' + user.status);
                    })
                });
            });
        };
        /**
         * Get all User
         */
        function getUsers() {
            return User.query({}, function (data) {
                vm.users = data;
            })
        }

        vm.deletePhoto = function(photo){
            $http.delete('/api/admin/delete/'+photo.postedBy.username +'/'+ photo.album_id+'/'+photo.filename).then(function(res){
                getComplainPhotos();
                showFlashMessage('success', 'PHOTO DELETED' );
            })
        };

        function getComplainPhotos(){
            return $http.get('/api/admin/complain/photos').then(function(res) {
               vm.albums = res.data.complain;
            })
        }

        /**
         * Show message on server response
         * @param type ['success', 'info', 'warning', 'danger']
         * @param text
         */
        function showFlashMessage(type, text) {
            $rootScope.message = {type: type, text: text};
        }
    }

})();