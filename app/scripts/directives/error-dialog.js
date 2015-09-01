'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:errorDialog
 * @description
 * # errorDialog
 */
angular.module('ts5App')
  .directive('errorDialog', function() {
    var errorDialogController = function() {
      console.log('controller triggered');
    };
    return {
      templateUrl: '/views/directives/error-dialog.html',
      restrict: 'E',
      controller: errorDialogController
    };
  });
