(function () {
    angular
        .module('blog')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['User', 'FlashMessage', '$http', 'UsersService', 'Pagination'];

    function AdminController(User, FlashMessage, $http, UsersService, Pagination) {
        var vm = this;
        vm.delete = _delete;
        vm.ban = ban;
        vm.deletePhoto = deletePhoto;

        getComplainPhotos();

        vm.currentPage = 1;
        vm.users = [];
        vm.pagesCount = 0;
        vm.paginationList = [];

        vm.getPage = getPage;

        getPage(vm.currentPage);

        function getPage(pageNum){
            Pagination.setGetPageFunc(UsersService.getPage);
            if(pageNum == 'prev'){
                Pagination.getPrevPage().then(function () {
                    setPageData();
                });
            } else if(pageNum == 'next'){
                Pagination.getNextPage().then(function () {
                    setPageData();
                });

            } else {
                Pagination.getPage(pageNum).then(function () {
                    setPageData();
                });
            }
        }

        function setPageData(){
            vm.users = Pagination.getPageItems();
            vm.paginationList = Pagination.getPaginationList();
            vm.currentPage = Pagination.getCurrentPageNum();
        }

        /**
         * Delete User by id
         * @param id
         */
        function _delete(id) {
            vm.dialog = {
                title: 'Deleting user',
                body: '<h1>User with  ID \''+ id +'\' will be deleted</h1>',
                onConfirm: function () {
                    User.delete({id: id}, function () {
                        getUsers().$promise.then(function () {
                            FlashMessage.create(FlashMessage.TYPE.SUCCESS, 'User (id = ' + id + ') was successfully deleted.')
                        });
                    })
                }
            };
            vm.dialogVisible = true;
        }

        /**
         * Ban and unban User by id
         * @param id
         */
        function ban(id) {
            User.getOne({id: id}, function (user) {
                user.status == 'active'
                    ? user.status = 'baned'
                    : user.status = 'active';
                User.update({id: user._id}, {status: user.status}, function () {
                    getUsers().$promise.then(function () {
                        FlashMessage.create(FlashMessage.TYPE.INFO, 'User ' + user.username + ' status: ' + user.status);
                    })
                });
            });
        }

        /**
         * Get all User
         */
        function getUsers() {
            return User.query({}, function (data) {
                vm.users = data;
            })
        }

        function deletePhoto(photo) {
            $http.delete('/api/admin/delete/'+photo.postedBy.username +'/'+ photo.album_id+'/'+photo.filename)
                .then(function() {
                    getComplainPhotos();
                    FlashMessage.create(FlashMessage.TYPE.SUCCESS, 'PHOTO DELETED' );
                })
        }

        function getComplainPhotos() {
            return $http.get('/api/admin/complain/photos').then(function(res) {
               vm.albums = res.data.complain;
            })
        }
    }
})();