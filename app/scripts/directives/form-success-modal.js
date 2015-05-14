'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:formSuccessModal
 * @description
 * # formSuccessModal
 */
angular.module('ts5App')
  .directive('formSuccessModal', function () {
     return {
      templateUrl: 'views/directives/form-success-modal.html',
      restrict: 'E',
      scope: false
    };
  });
