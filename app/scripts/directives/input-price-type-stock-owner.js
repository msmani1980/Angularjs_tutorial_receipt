'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputPriceTypeStockOwner
 * @description
 * # inputPriceTypeStockOwner
 */
angular.module('ts5App')
  .directive('inputPriceTypeStockOwner', function () {

    return {

    	templateUrl: '/views/directives/input-price-type-stock-owner.html',
    	restrict: 'E',
    	scope: true

    };

  });
