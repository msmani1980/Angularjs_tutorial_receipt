'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:datePicker
 * @description
 * # datePicker
 */
angular.module('ts5App')
  .directive('datePicker', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the datePicker directive');
      }
    };
  });
