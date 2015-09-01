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
      steps: '=',
      nextTrigger: '&',
      nextTriggerParams: '=',
      prevTrigger: '&',
      prevTriggerParams: '='
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

      $scope.goToStepURI = function($index){
        // Only allow previous steps to be clicked
        if($index >= currentStepIndex){
          return false;
        }
        // We call prevTrigger here, since the user wants to go back
        if(angular.isDefined($scope.prevTrigger)){
          $scope.prevTrigger($scope.prevTriggerParams);
        }
        $location.url($scope.steps[$index].uri);
      };

      $scope.wizardPrev = function(){
        if(!currentStepIndex--){
          return false;
        }
        $scope.goToStepURI(currentStepIndex--);
      };

      $scope.wizardNext = function(){
        if(angular.isDefined($scope.prevTrigger)){
          $scope.prevTrigger($scope.prevTriggerParams);
        }
        // No more steps, dont do anything
        if(currentStepIndex+1 > $scope.steps.length){
          return false;
        }
        if(angular.isDefined($scope.nextTrigger)){
          $scope.nextTrigger($scope.nextTriggerParams);
        }
        // navigating the user to the next page should
        // be handled by the controller nextTrigger scope function
      };
    }
  };

});
