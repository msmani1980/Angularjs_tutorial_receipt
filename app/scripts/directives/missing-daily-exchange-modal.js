'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:missingDailyExchangeModal
 * @description
 * # missingDailyExchangeModal
 */
angular.module('ts5App')
  .directive('missingDailyExchangeModal', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the missingDailyExchangeModal directive' + attrs);
      }
    };
  });
