'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:dynamicLeftNav
 * @description
 * # dynamicLeftNav
 */
angular.module('ts5App')
  .directive('dynamicLeftNav', function () {

    var dynamicLeftNavController = function ($scope, $location, $filter, mainMenuService) {
      var menu = mainMenuService.getAll();
      var menuItems = [];
      if($scope.title) {
        menuItems = $filter('filter')(menu, {title: $scope.title}, true);
      }
      else{
        menuItems = $filter('filter')(menu, {menuItems: {route: $location.path()}});
      }
      if(menuItems.length){
        $scope.menuItems = menuItems[0].menuItems;
      }

      $scope.leaveViewNav = function (path) {
        if (path.substring(0, 2) === '/#') {
          path = path.substring(2);
        }
        $location.path(path);
      };

      $scope.itemClass = function(path) {
        var itemClass = '';
        if('/#'+$location.path() === path){
          itemClass += ' active';
        }
        return itemClass;
      };

    };

    return {
      templateUrl: '/views/directives/dynamic-left-nav.html',
      restrict: 'E',
      scope: {
        title: '@',
        isEditing: '@'
      },
      controller: dynamicLeftNavController
    };
  });
