'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputTaxType
 * @description
 * # editFormHeaderDirective
 */
angular.module('ts5App')
  .directive('inputTaxType', function () {
    return {
      templateUrl: '/views/directives/input-tax-type.html',
      restrict: 'E',
      scope: true
    };
  });
