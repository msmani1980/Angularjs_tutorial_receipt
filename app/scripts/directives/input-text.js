'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputText
 * @description
 * # editFormHeaderDirective
 */
angular.module('ts5App')
  .directive('inputText', function () {

    return {

      	templateUrl: 'views/directives/input-text.html',
      	restrict: 'E',
      	scope: true, // isolate scope to directive only

	  	controller: function ($scope, $element, $attrs) {

	  		// set attributes of directive to the scope to use in template
	      	$scope.field = $attrs;

          $scope.parseInt = parseInt;

	    }

    };

  });
