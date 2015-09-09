'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:errorDialog
 * @description
 * # errorDialog
 */
angular.module('ts5App')
  .directive('errorDialog', function() {
    var errorDialogController = function($scope) {

      var form = $scope.$parent[$scope.formObject.$name];
      $scope.errorPattern = [];
      $scope.errorRequired = [];
      $scope.$parent.displayError = false;

      $scope.validateRequiredFields = function() {
        $scope.errorRequired = [];
        angular.forEach(form.$error.required, function(field) {
          if (field.$invalid) {
            var fieldName = field.$name;
            $scope.errorRequired.push(fieldName);
          }
        });
      };

      $scope.validatePatternFields = function() {
        $scope.errorPattern = [];
        angular.forEach(form.$error.pattern, function(field) {
          if (field.$invalid && field.$viewValue) {
            var fieldName = field.$name;
            $scope.errorPattern.push(fieldName);
          }
        });
      };

      $scope.checkForErrors = function() {
        $scope.validateRequiredFields();
        $scope.validatePatternFields();
      };

      $scope.watchForm = function() {
        if (form && form.$error) {
          var formName = $scope.formObject.$name;
          var watchGroup = formName + '.$error.pattern + ' + formName + '.$error.required';
          $scope.$parent.$watch(watchGroup, function() {
            $scope.checkForErrors();
          });
          $scope.$parent.$watchCollection(formName + '.$error', function() {
            var error = form.$error;
            if (!error.pattern && !error.required) {
              $scope.$parent.displayError = false;
            }
          });
        }
      };

      $scope.watchForm();

    };
    return {
      templateUrl: '/views/directives/error-dialog.html',
      restrict: 'E',
      controller: errorDialogController,
      scope: {
        formObject: '='
      }
    };
  });
