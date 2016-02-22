angular.module('blog', ['ngRoute'])
    .factory("User", function($resource) {
        return $resource("/admin/users/:id");
    });