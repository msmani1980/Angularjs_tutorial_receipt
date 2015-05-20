'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputItemImage
 * @description
 * # inputItemImage
 */
angular.module('ts5App')
  .directive('inputItemImage', function () {

    return {

    	templateUrl: 'views/directives/input-item-image.html',
    	restrict: 'E',
    	scope: true

    };

});
