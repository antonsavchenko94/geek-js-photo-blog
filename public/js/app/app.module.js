angular.module('blog', ['ngRoute', 'ngResource', 'ngFileUpload'])
    .factory("User", User);

    User.$inject = ['$resource'];

    function User($resource) {
        return $resource("/api/admin/users/:id", {id: '@_id'},
            {
                update: {method: 'PUT'},
                delete: {method: 'DELETE'},
                query:  {method: 'GET', isArray: true},
                getOne: {method: 'GET', isArray: false}
            }
        );
    }