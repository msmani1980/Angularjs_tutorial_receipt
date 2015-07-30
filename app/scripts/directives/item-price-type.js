'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputPriceType
 * @description
 * # editFormHeaderDirective
 */
angular.module('ts5App')
  .directive('inputPriceType', function () {

    return {
    	templateUrl: '/views/directives/input-price-type.html',
    	restrict: 'E',
    	scope: true
    };

  });
