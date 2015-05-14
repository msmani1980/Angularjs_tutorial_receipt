'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:formErrorDialog
 * @description
 * # formErrorDialog
 */
angular.module('ts5App')
  .directive('formErrorDialog', function () {
    return {
      templateUrl: 'views/directives/form-error-dialog.html',
      restrict: 'E',
      scope: false
    };
  });
