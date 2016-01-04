'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:customFocus
 * @description
 * # customFocus
 */
angular.module('ts5App')
  .directive('customFocus', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.customFocus, function(customFocus) {
          $timeout(function() {
            if (customFocus) {
              element[0].focus();
            }
          });
        }, true);
      }
    };
  });
