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
      templateUrl: 'views/directives/menu-dropdown.html',
      scope: {
        title: '@',
        ngModel: '=',
        icon: '@',
      },
      controller: function($scope) {
        this.setChoice = function(_choice_) {
          $scope.ngModel.set(_choice_);
        };
      },
      controllerAs: 'item',
    };
  });
