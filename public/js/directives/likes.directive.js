(function () {
    angular
        .module('blog')
        .directive('likes', likes);

    function likes() {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                photo: '='
            },
            controllerAs: "vm",
            link: function (scope, elem, attrs, ctrl) {

                scope.$watch('vm.photo', function (photo) {
                    if (photo)
                        ctrl.getLikes(photo._id);
                });

                scope.$watch('vm.liked', function (liked) {
                   if (liked)
                       angular.element(elem.children()[0]).addClass('btn-primary');
                    else
                       angular.element(elem.children()[0]).removeClass('btn-primary');
                });

            },
            controller: function (PhotoService, $routeParams, $rootScope) {
                var vm = this;

                vm.liked = false;
                vm.likedCount = 0;
                vm.baned = $rootScope.user.status == 'baned';

                vm.toggleLikes = toggleLikes;
                vm.getLikes = getLikes;

                function toggleLikes() {
                    PhotoService.toggleLikes(vm.photo._id, $routeParams.album_id).then(function (qLikes) {
                        vm.liked = qLikes.liked;
                        vm.likedCount = qLikes.likes.by.length;
                    });
                }

                function getLikes(photo_id) {
                    PhotoService.getLikes(photo_id).then(function (likes) {
                        vm.liked = likes.liked;
                        vm.likedCount = likes.likes.by ? likes.likes.by.length  : 0 ;
                    })
                }
            },
            templateUrl: 'template/likes.html'
        }
    }
})();
