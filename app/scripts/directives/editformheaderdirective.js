'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:editFormHeaderDirective
 * @description
 * # editFormHeaderDirective
 */
angular.module('ts5App')
  .directive('editFormHeaderDirective', function () {

    return {
      templateUrl: 'views/directives/edit-form-header.html',
      restrict: 'E',
    };
  });
