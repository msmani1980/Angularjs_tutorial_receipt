'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:menuDropdown
 * @description
 * # menuDropdown
 */
angular.module('ts5App')
  .directive('bsDropdown', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/bs-dropdown.html',
      scope: {
        title: '@',
        viewModel: '=',
        icon: '@'
      },
      link: function(scope, element) {
        scope.setChoice = function(choiceId) {
          scope.viewModel.set(choiceId);
        };
        element.bind('click', function (event) {
          event.stopPropagation();
        });
      }
    };
  });
