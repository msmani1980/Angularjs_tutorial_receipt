'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:dynamicLeftNav
 * @description
 * # dynamicLeftNav
 */
angular.module('ts5App')
  .directive('dynamicLeftNav', function () {

    var dynamicLeftNavController = function ($scope, $location) {
      $scope.locationPath = $location.path();
      console.log($scope.locationPath);
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
