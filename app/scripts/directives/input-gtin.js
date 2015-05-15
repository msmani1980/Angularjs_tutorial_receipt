  'use strict';

  /**
   * @ngdoc directive
   * @name ts5App.directive:inputGtin
   * @description
   * # inputGtin
   */
  angular.module('ts5App')
    .directive('inputGtin', function () {

      return {

      	templateUrl: 'views/directives/input-gtin.html',
      	restrict: 'E',
      	scope: true

      };

  });
