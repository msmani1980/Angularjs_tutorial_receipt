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
    scope: {
      steps: '='
    },
    controller: function($scope, $location) {
      console.log($scope.steps);
      $scope.stepClass = function(step){

      };
      $scope.goToStep = function(step, $index){
        console.log(step);
      };
    }
  };

});
