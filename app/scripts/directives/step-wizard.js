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
      disabled: '=',
      uri:'=',
      nextTrigger: '&',
      prevTrigger: '&'
    },
    controller: function($scope, $location) {

      var currentStepIndex = null;

      // Maliformed uri cleanup
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
        $scope.steps.map(trailingSlashOnStepURI);
      }
      function init(){
        trailingSlashes();
      }
      init();

      function callTrigger(trigger, toIndex){
        $scope.$parent.wizardStepToIndex = toIndex;
        if(angular.isUndefined($scope[trigger])) {
          return true;
        }
        var triggerReturn = $scope[trigger]();
        if(typeof triggerReturn !== 'boolean') {
          return true;
        }
        return triggerReturn;
      }

      function resolveTrigger(autoStep, toIndex){
        if(!autoStep) {
          return false;
        }
        $location.url($scope.steps[toIndex].uri);
        return true;
      }

      $scope.goToStepURI = function($index){
        if($scope.disabled){
          return false;
        }
        if($index < 0){
          return false;
        }
        // Only allow previous steps to be clicked
        if($index >= currentStepIndex){
          return false;
        }
        // if controller's prev-trigger scope function returns false
        // the wizard will NOT step backwards
        var autoStepBackwards = callTrigger('prevTrigger', $index);
        return resolveTrigger(autoStepBackwards, $index);
      };

      $scope.wizardPrev = function(){
        if($scope.disabled){
          return false;
        }
        var prevIndex = currentStepIndex - 1;
        if(prevIndex < 0){
          return false;
        }
        return $scope.goToStepURI(prevIndex);
      };

      $scope.wizardNext = function(){
        if($scope.disabled){
          return false;
        }
        var nextIndex = currentStepIndex + 1;
        // No more steps, dont do anything
        if(nextIndex > $scope.steps.length){
          return false;
        }
        // If the controller's next-trigger scope function returns false
        // the wizard will NOT step forward
        var stepForward = callTrigger('nextTrigger', nextIndex);
        return resolveTrigger(stepForward, nextIndex);
      };

      $scope.disablePrev = function(){
        if($scope.disabled){
          return true;
        }
        return !currentStepIndex;
      };

      $scope.disableNext = function(){
        if($scope.disabled){
          return true;
        }
        return (currentStepIndex === ($scope.steps.length - 1));
      };

      $scope.stepInit = function($index){
        if($location.path() === $scope.steps[$index].uri){
          currentStepIndex = $index;
        }
        if(null === currentStepIndex){
          $scope.steps[$index].class = 'completed';
          return;
        }
        if($index === currentStepIndex) {
          $scope.steps[$index].class = 'active';
          return;
        }
        if($index > currentStepIndex) {
          $scope.steps[$index].class = 'future';
          $scope.steps[$index].disabled = true;
        }
      };
    }
  };

});
