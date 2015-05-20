'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:formUpdateModal
 * @description
 * # formUpdateModal
 */
angular.module('ts5App')
  .directive('formUpdateModal', function () {
    return {
      templateUrl: 'views/directives/form-update-modal.html',
      restrict: 'E',
      scope: false
    };
  });
