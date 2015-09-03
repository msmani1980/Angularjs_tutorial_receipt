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

      $scope.displayError = false;

      $scope.validateRequiredFields = function(error) {
        $scope.errorRequired = [];
        angular.forEach(error.required, function(field) {
          if (field.$invalid) {
            var fieldName = field.$name;
            $scope.errorRequired.push(fieldName);
          }
        });
      };

      $scope.validatePatternFields = function(error) {
        $scope.errorPattern = [];
        angular.forEach(error.pattern, function(field) {
          if (field.$invalid && field.$viewValue) {
            var fieldName = field.$name;
            $scope.errorPattern.push(fieldName);
          }
        });
      };

      $scope.checkForErrors = function() {
        var error = $scope.form.$error;
        $scope.validateRequiredFields(error);
        $scope.validatePatternFields(error);
      };

      $scope.$watchCollection('form.$error.pattern + form.$error.required', function() {
        $scope.checkForErrors();
      });

      $scope.$watchCollection('form.$error', function() {
        var error = $scope.form.$error;
        if (!error.pattern && !error.required) {
          $scope.displayError = false;
        }
      });

    };
    return {
      templateUrl: '/views/directives/error-dialog.html',
      restrict: 'E',
      controller: errorDialogController
    };
  });
