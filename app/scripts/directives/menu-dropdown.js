'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:menuDropdown
 * @description
 * # menuDropdown
 */
angular.module('ts5App')
  .directive('menuDropdown', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/menu-dropdown.html',
      scope: {
        title: '@',
        ngModel: '=',
        icon: '@'
      },
      link: function($scope) {
        $scope.setChoice = function(choiceId) {
          $scope.ngModel.set(choiceId);
        };
      }
    };
  });
