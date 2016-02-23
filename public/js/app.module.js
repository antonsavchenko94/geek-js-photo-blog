angular.module('blog', ['ngRoute', 'ngResource'])
    .factory("User", function ($resource) {
        return $resource("/admin/users/:id", {id: '@_id'},
            {
                update: {method: 'PUT'},
                delete: {method: 'DELETE'},
                query:  {method: 'GET', isArray: true},
                getOne: {method: 'GET', isArray: false}
            }
        );
    });