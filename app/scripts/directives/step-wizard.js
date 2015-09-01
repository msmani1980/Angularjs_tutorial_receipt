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

      var currentStepIndex = 0;

      function setStepClasses(){
        for(var i in $scope.steps){
          if(i < currentStepIndex || i === currentStepIndex) {
            $scope.steps[i].class = 'active';
          }
        }
      }

      function setCurrentStepIndex(){
        for(var i in $scope.steps){
          if($location.path() === $scope.steps[i].uri){
            currentStepIndex = i;
          }
        }
      }

      function trailingSlashOnStepURI(step){
        // Add trailing slash to step URI if one exists in address bar
        if ($location.path().match(/\/$/) && !step.uri.match(/\/$/)) {
          step.uri += '/';
        }
        // Remove trailing slash to step URI if not present in address bar
        if (!$location.path().match(/\/$/) && step.uri.match(/\/$/)) {
          step.uri = step.uri.substr(0, step.uri.length - 1);
        }
        return step;
      }
      function trailingSlashes(){
        $scope.steps.map(trailingSlashOnStepURI)
      }
      function init(){
        trailingSlashes();
        setCurrentStepIndex();
        setStepClasses();
      }
      init();

      $scope.goToStepURI = function($index, uri){
        // Only allow previous steps to be clicked
        if($index >= currentStepIndex){
          return false;
        }
        $location.url(uri);
      };
    }
  };

});
