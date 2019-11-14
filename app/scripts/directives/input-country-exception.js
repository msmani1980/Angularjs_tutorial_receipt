'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputCountryException
 * @description
 * # inputCountryException
 */
angular.module('ts5App')
  .directive('inputCountryException', function () {

    return {
      templateUrl: '/views/directives/input-country-exception.html',
      restrict: 'E',
      scope: true
    };

  });
