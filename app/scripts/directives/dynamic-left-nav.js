'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:dynamicLeftNav
 * @description
 * # dynamicLeftNav
 */
angular.module('ts5App')
  .directive('dynamicLeftNav', function () {

    var dynamicLeftNavController = function ($scope, $location, mainMenuService) {
      $scope.locationPath = $location.path();
      var menu = mainMenuService.getMenu();
      console.log($scope.locationPath);
      console.log($filter('filter')(menu, {route: $scope.locationPath})[0]);
    };

    return {
      templateUrl: '/views/directives/dynamic-left-nav.html',
      restrict: 'E',
      scope: {
        basePath: '@'
      },
      controller: dynamicLeftNavController
    };
  });
