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
                vm.baned = $rootScope.user.status == 'baned';

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
            templateUrl:'template/comment.html'
        }
    }
})();