'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputVirtualImage
 * @description
 * # inputVirtualImage
 */
angular.module('ts5App')
  .directive('inputVirtualImage', function () {

    return {

      templateUrl: 'views/directives/input-virtual-image.html',
      restrict: 'E',
      scope: true

    };

  });

