'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:accordianPanel
 * @description
 * # accordianPanel
 */
angular.module('ts5App')
  .directive('accordianPanel', function() {
    return {
      templateUrl: 'views/directives/accordian-panel.html',
      restrict: 'E'
    };
  });
