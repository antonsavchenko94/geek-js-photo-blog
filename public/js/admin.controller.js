(function () {
    angular
        .module('blog')
        .controller('AdminController', AdminController);

    function AdminController($scope, User) {
        getUsers();
        /**
         * Delete User by id
         * @param id
         */
        $scope.delete = function (id) {
            User.delete({id: id}, function () {
                alert("User " + id + "delete");
                getUsers();
            })
        };
        /**
         * Ban and unban User by id
         * @param id
         */
        $scope.ban = function (id) {
            User.getOne({id: id}, function (user) {
                user.status == 'active'
                    ? user.status = 'baned'
                    : user.status = 'active';
                User.update({id: user._id}, {status: user.status}, function () {
                    alert("User " + user.username + " " + user.status);
                    getUsers();
                });
            });
        };
        /**
         * Get all User
         */
        function getUsers() {
            User.query({}, function (data) {
                $scope.users = data;
            })
        }
    }

})();