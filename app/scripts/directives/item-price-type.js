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
      	scope: false, // isolate scope to directive only

	  	controller: function ( $scope, $element,$compile ) {

	      $scope.add = function () {
	        var el = $compile( '<input-price-type></input-price-type>' )( $scope );
	        angular.element('#price-type-container').append( el );
	      };

	    }

    };
    
  });
