'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:stepWizard
 * @description
 * # stepWizard
 */
angular.module('ts5App')
.directive('stepWizard', function () {
  return {
    templateUrl: '/views/directives/step-wizard.html',
    restrict: 'E',
    scope: false,
    controller: function ($scope) {

      $scope.steps = [
        {
          label: 'Create Store Instance'
        },
        {
          label: 'Packing'
        },
        {
          label: 'Assign Seals'
        },
        {
          label: 'Review & Dispatch'
        }
      ];

    }

  };

});
