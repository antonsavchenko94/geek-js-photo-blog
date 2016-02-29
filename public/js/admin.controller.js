(function () {
    angular
        .module('blog')
        .controller('AdminController', AdminController);

    function AdminController($scope, User, $rootScope) {
        getUsers();
        /**
         * Delete User by id
         * @param id
         */
        $scope.delete = function (id) {
            User.delete({id: id}, function () {
                getUsers().$promise.then(function () {
                    showFlashMessage('success', 'User (id = ' + id + ') was successfully deleted.')
                });
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
                $scope.users = data;
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