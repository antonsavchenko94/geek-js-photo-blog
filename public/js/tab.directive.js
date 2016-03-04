(function(){
    angular
        .module('blog')
        .directive('tabContainer', tabContainer)
        .directive('tab', tab);

    /**
     * <tab-container on-tab-select="function(...)">
     *     <tab title="myTitle"> Content </tab>
     * </tab-container>
     */
    function tabContainer() {
        return {
            restrict: 'E',
            transclude: true,
            bindToController: {
                onTabSelect: "&"
            },
            controllerAs: 'container',
            controller: function($rootScope) {
                var vm = this;
                vm.tabs = [];

                vm.add = function(tab) {
                    vm.tabs.push(tab);
                    vm.tabs[0].active = true;
                };

                vm.select = function(selectedTab) {
                    vm.tabs.forEach(function(tab){
                        tab.active = false;
                    });

                    selectedTab.active = true;
                    $rootScope.message = null;
                    vm.onTabSelect();
                }
            },
            template:
            '<div class="well">' +
            '   <ul class="nav nav-tabs" ng-click="$event.preventDefault()">' +
            '       <li ng-repeat="tab in container.tabs" ng-class="{\'active\': tab.active}">' +
            '           <a href="#" ng-click="container.select(tab)"> {{ tab.title }}</a>' +
            '       </li>' +
            '   </ul>' +
            '   <div class="tab-content" ng-transclude></div>' +
            '</div>'
        }
    }

    function tab() {
        return {
            restrict: 'E',
            require: '^tabContainer',
            transclude: true,
            scope: {
                title: '@'
            },
            link: function(scope, elem, attr, container) {
                scope.active = false;
                container.add(scope);
            },
            template: '<div class="tab-pane" ng-show="active" ng-transclude></div>'
        }
    }
})();
