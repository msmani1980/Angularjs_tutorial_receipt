'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:errorDialog
 * @description
 * # errorDialog
 */
angular.module('ts5App')
  .directive('errorDialog', function() {

    var errorDialogController = function($scope,$document) {

      var $this = this;

      this.setFormObject = function() {
        if($scope.formObject && $scope.formObject.$name) {
          this.form = $scope.$parent[$scope.formObject.$name];
        }
      };

      this.formatErrorText = function(text) {
        return text.split(/(?=[A-Z])/).join(' ');
      };

      this.httpResponseErrorHandler = function() {
        $this.httpResponseError = true;
      };

      this.scrollToDialog = function() {
        var top = 25;
        var duration = 2000;
        $document.scrollTop(top, duration);
      };

      this.setScrollWatch = function() {
        $scope.$watch('display',function(currentFlag){
          if(currentFlag === true) {
            $this.scrollToDialog();
          }
        });
      };

      this.init = function() {
        this.setFormObject();
        $scope.errorPattern = [];
        $scope.errorRequired = [];
        $scope.$on('http-response-error', this.httpResponseErrorHandler);
        this.setScrollWatch();
        this.watchForm();
      };

      this.validateRequiredFields = function() {
        $scope.errorRequired = [];
        if($this.form) {
          angular.forEach(this.form.$error.required, function(field) {
            if (field.$invalid) {
              var fieldName = $this.formatErrorText(field.$name);
              $scope.errorRequired.push(fieldName);
            }
          });
        }
      };

      this.validatePatternFields = function() {
        $scope.errorPattern = [];
        if($this.form) {
          angular.forEach(this.form.$error.pattern, function(field) {
            if (field.$invalid && field.$viewValue) {
              var fieldName = $this.formatErrorText(field.$name);
              $scope.errorPattern.push(fieldName);
            }
          });
        }
      };

      this.checkForErrors = function() {
        this.validateRequiredFields();
        this.validatePatternFields();
      };

      this.watchForm = function() {
        if (this.form && this.form.$error) {
          var formName = $scope.formObject.$name;
          var watchGroup = formName + '.$error.pattern + ' + formName + '.$error.required';
          $scope.$parent.$watchCollection(watchGroup, function() {
            $this.checkForErrors();
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

      $scope.showCustomErrors = function() {
        return ( Array.isArray($scope.$parent.errorCustom) && $scope.$parent.errorCustom.length > 0 );
      };

      $scope.showInternalServerError = function() {
        return ( $this.httpResponseError  && !$scope.showValidationErrors() );
      };

      $scope.showValidationErrors = function() {
        if(angular.isUndefined($this.form)) {
          return false;
        }
        return !$scope.showCustomErrors() &&
           ( (Array.isArray($this.form.$error.pattern) || Array.isArray($this.form.$error.required) ));
      };

      $scope.showFailedRequest = function() {
        return ( $scope.errorResponse && !$scope.showValidationErrors() && !$scope.showInternalServerError() );
      };


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
