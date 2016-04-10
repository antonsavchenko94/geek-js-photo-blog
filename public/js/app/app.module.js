angular.module('blog', ['ngRoute', 'ngResource', 'ngFileUpload', 'yaru22.angular-timeago'])
    .factory("User", function ($resource) {
        return $resource("/api/admin/users/:id", {id: '@_id'},
            {
                update: {method: 'PUT'},
                delete: {method: 'DELETE'},
                query:  {method: 'GET', isArray: true},
                getOne: {method: 'GET', isArray: false}
            }
        );
    });