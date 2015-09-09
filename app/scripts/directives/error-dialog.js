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

      $scope.errorPattern = [];
      $scope.errorRequired = [];
      $scope.displayError = false;

      $scope.validateRequiredFields = function() {
        $scope.errorRequired = [];
        angular.forEach($scope.form.$error.required, function(field) {
          if (field.$invalid) {
            var fieldName = field.$name;
            $scope.errorRequired.push(fieldName);
          }
        });
      };

      $scope.validatePatternFields = function() {
        $scope.errorPattern = [];
        angular.forEach($scope.form.$error.pattern, function(field) {
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
        if ($scope.form && $scope.form.$error) {
          $scope.$watch('form.$error.pattern + form.$error.required', function() {
            $scope.checkForErrors();
          });
          $scope.$watchCollection('form.$error', function() {
            var error = $scope.form.$error;
            if (!error.pattern && !error.required) {
              $scope.displayError = false;
            }
          });
        }
      };

      $scope.watchForm();

    };
    return {
      templateUrl: '/views/directives/error-dialog.html',
      restrict: 'E',
      controller: errorDialogController
    };
  });
