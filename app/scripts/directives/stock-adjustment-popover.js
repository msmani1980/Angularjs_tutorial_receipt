'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:stockAdjustmentPopover
 * @description
 * # stockAdjustmentPopover
 */
angular.module('ts5App')
  .directive('stockAdjustmentPopover', function() {
    return function(scope, element) {
      element.find('td[rel=popover]').popover({
        placement: 'top',
        html: 'true'
      });
    };
  });
