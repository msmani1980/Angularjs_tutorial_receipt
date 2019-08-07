'use strict';

/**
 * @ngdoc service
 * @name ts5App.formValidationUtility
 * @description
 * # formValidationUtility
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('formValidationUtility', function (dateUtility) {
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

    this.calendarCssClassWithAdditionalChecks = function(form, startDate, endDate) {
      var hasError = false;

      if (form && form.$submitted) {
        hasError = !startDate && form.$submitted;
      }

      if (form && form.$submitted) {
        hasError = !endDate && form.$submitted;
      }

      if (form && form.$submitted && startDate && endDate) {
        if (!dateUtility.isAfterOrEqualDatePicker(endDate, startDate)) {
          hasError = true;
        }
      }

      return { 'has-error': hasError, 'has-success': !hasError };
    };
  });
