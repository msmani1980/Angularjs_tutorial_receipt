'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputStationException
 * @description
 * # inputStationException
 */
angular.module('ts5App')
  .directive('inputStationException', function () {

    return {
      	templateUrl: '/views/directives/input-station-exception.html',
      	restrict: 'E',
      	scope: true
    };

  });
