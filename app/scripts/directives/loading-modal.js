'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:loadingModal
 * @description
 * # loadingModal
 */
angular.module('ts5App')
  .directive('loadingModal', function () {
    return {
      templateUrl: 'views/directives/loading-modal.html',
      restrict: 'E',
      scope: true
    };
  });
