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
        setCurrentStepIndex();
        setStepClasses();
      }
      init();

      function callTrigger(trigger){
        if(!angular.isDefined($scope[trigger])) {
          return true;
        }
        var triggerReturn = $scope[trigger]();
        if(typeof triggerReturn !== 'boolean') {
          return true;
        }
        return triggerReturn;
      }

      $scope.goToStepURI = function($index){
        if($index < 0){
          return false;
        }
        // Only allow previous steps to be clicked
        if($index >= currentStepIndex){
          return false;
        }
        // if controller's prev-trigger scope function returns false
        // the wizard will NOT step backwards
        var stepBackwards = callTrigger('prevTrigger');
        if(stepBackwards) {
          $location.url($scope.steps[$index].uri);
        }
        return stepBackwards;
      };

      $scope.wizardPrev = function(){
        var prevIndex = parseInt(currentStepIndex, 10) - 1;
        if(prevIndex < 0){
          return false;
        }
        return $scope.goToStepURI(prevIndex);
      };

      $scope.wizardNext = function(){
        var nextIndex = parseInt(currentStepIndex, 10) + 1;
        // No more steps, dont do anything
        if(nextIndex > $scope.steps.length){
          return false;
        }
        // If the controller's next-trigger scope function returns false
        // the wizard will NOT step forward
        var stepForward = callTrigger('nextTrigger');
        if(stepForward){
          var uri = $scope.steps[nextIndex].uri;
          $location.url(uri);
        }
        return stepForward;
      };
    }
  };

});
