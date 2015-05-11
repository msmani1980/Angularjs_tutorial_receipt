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

    	templateUrl: 'views/directives/input-price-type.html',
    	restrict: 'E',
    	scope: true,

	  	controller: function ( $scope, $element,$compile, $attrs) {

        this.priceTypeModel = $attrs.pricetypemodel;

        console.log('setting the price type model from directive ' + this.priceTypeModel);
	    }

    };

  });
