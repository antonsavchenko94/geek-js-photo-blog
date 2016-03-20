(function () {
    angular
        .module('blog')
        .service('CommentsService', CommentsService)
        .directive('showComments', ['CommentsService', '$rootScope', showComments]);
    

    CommentsService.$inject = ['$http'];

    function CommentsService($http){
        return{
            getComments:getComments,
            saveComments: saveComments

        };

        function getComments(photo, successCb, failureCb){
            return $http.get('/api/comments/' + photo)
                .then(successCb)
                .catch(failureCb);
        }

        function saveComments(comment, successCb, failureCb){
            return $http.post('/api/comments/save', comment)
                .then(successCb)
                .catch(failureCb);
        }
    }

    function showComments() {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                commentsTo: '='
            },
            controllerAs: 'vm',
            controller: function(CommentsService, $rootScope) {
                var vm = this;
                vm.comments = null;

                vm.viewComments = function () {
                    CommentsService.getComments(vm.commentsTo._id, function(res){
                        vm.comments = res.data;
                    });
                };

                vm.viewComments();

                vm.postComment = function (){
                    var newComment = {
                        "value":vm.comment,
                        "postedTo":vm.commentsTo._id,
                        "postedBy":$rootScope.user._id
                    };
                    vm.comment = '';
                    CommentsService.saveComments(newComment, function(res){
                        if(res.status === 200){
                            $rootScope.message = {type: 'success', text: res.data};
                            vm.viewComments();
                        }else if(res.status === 400){
                            $rootScope.message = {type: 'warning', text: res.data};
                        }

                    })
                }
            },
            template:
            '<div class="row">'+
                ' <div class="col-lg-6"> ' +
                    '<div class="input-group"> ' +
                        '<input type="text" class="form-control" placeholder="Enter your comment" ng-model="vm.comment"> ' +
                        '<span class="input-group-btn"> <button class="btn btn-default" type="button" ng-click="vm.postComment()">Post</button></span> ' +
                '</div>' +
            '</div>'+
                '<div ng-repeat="comment in vm.comments" >'+
                    '<div class="media comment">'+
                        '<div class="media-left">'+
                            '<a href="/user/{{comment.postedBy.username}}">' +
                                '<img class="media-object" src="/images/no-avatar.png" alt="...">' +
                            '</a>'+
                        '</div>'+
                        '<div class="media-body">'+
                            '<h4 class="media-heading">' +
                                '<a href="/user/{{comment.postedBy.username}}">' +
                                    '{{comment.postedBy.username}}' +
                                '</a>'+
                            '</h4>'+
                            '{{comment.value}}'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
        }
    }
})();