(function() {
    angular
        .module('blog')
        .controller('AdminController', AdminController);
    //AdminController.$inject = ['User', '$resource'];

    function AdminController($scope, User){
        getUsers();
        $scope.delete = function (id){
            User.delete({id: id}, function(){
                alert("User "+ id + "delete");
                getUsers();
            })
        };
        function getUsers (){
            User.query({}, function(data){
                $scope.users = data;
            })
        }
    }
})();