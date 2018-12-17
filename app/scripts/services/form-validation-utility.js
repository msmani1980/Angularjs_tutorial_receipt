'use strict';

/**
 * @ngdoc service
 * @name ts5App.formValidationUtility
 * @description
 * # formValidationUtility
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('formValidationUtility', function () {
    this.fieldCssClass = function(form, fieldName) {
      var hasError = false;
      var hasSuccess = false;

      if (form[fieldName] && form) {
        hasError = form.$submitted && form[fieldName].$invalid;
        hasSuccess = (form[fieldName].$touched || form.$submitted) && form[fieldName].$valid;
      }

      return { 'has-error': hasError, 'has-success': hasSuccess };
    };

    this.calendarCssClass = function(form, fieldValue) {
      var hasError = false;
      var hasSuccess = false;

      if (form) {
        hasError = !fieldValue && form.$submitted;
        hasSuccess = fieldValue && form.$submitted;
      }

      return { 'has-error': hasError, 'has-success': hasSuccess };
    };
  });
