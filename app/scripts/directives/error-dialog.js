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

      var $this = this;
      this.form = $scope.$parent[$scope.formObject.$name];

      this.formatErrorText = function(text) {
        return text.split(/(?=[A-Z])/).join(' ');
      };

      this.internalServerErrorHandler = function() {
        $this.internalServerError = true;
      };

      this.init = function() {
        $scope.errorPattern = [];
        $scope.errorRequired = [];
        $scope.$on('internal-server-error', this.internalServerErrorHandler);
        $scope.watchForm();
      };

      $scope.showInternalServerError = function() {
        return $this.internalServerError;
      };

      $scope.showValidationErrors = function() {
        return ( Array.isArray($this.form.$error.pattern) || Array.isArray($this.form.$error.required) );
      };

      $scope.showFailedRequest = function() {
        return ( $scope.errorResponse && !$scope.showValidationErrors() && !$scope.showInternalServerError() );
      };

      $scope.validateRequiredFields = function() {
        $scope.errorRequired = [];
        angular.forEach($this.form.$error.required, function(field) {
          if (field.$invalid) {
            var fieldName = $this.formatErrorText(field.$name);
            $scope.errorRequired.push(fieldName);
          }
        });
      };

      $scope.validatePatternFields = function() {
        $scope.errorPattern = [];
        angular.forEach($this.form.$error.pattern, function(field) {
          if (field.$invalid && field.$viewValue) {
            var fieldName = $this.formatErrorText(field.$name);
            $scope.errorPattern.push(fieldName);
          }
        });
      };

      $scope.checkForErrors = function() {
        $scope.validateRequiredFields();
        $scope.validatePatternFields();
      };

      $scope.watchForm = function() {
        if ($this.form && $this.form.$error) {
          var formName = $scope.formObject.$name;
          var watchGroup = formName + '.$error.pattern + ' + formName + '.$error.required';
          $scope.$parent.$watchCollection(watchGroup, function() {
            $scope.checkForErrors();
          });
          $scope.$parent.$watchCollection(formName + '.$error', function() {
            var error = $this.form.$error;
            if (!error.pattern && !error.required) {
              $scope.$parent.displayError = false;
            }
          });
        }
      };

      this.init();

    };
    return {
      templateUrl: '/views/directives/error-dialog.html',
      restrict: 'E',
      controller: errorDialogController,
      scope: {
        formObject: '=',
        errorResponse: '=',
        display: '='
      }
    };
  });
