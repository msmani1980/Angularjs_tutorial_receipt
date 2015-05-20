'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:customValidity
 * @description
 * # inputField
 */
angular.module('ts5App')
  .directive('customValidity', function () {
    return {
      restrict: 'A',
      require: '^ngModel',
      scope: true,
      link: function (scope, elem, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        var regexObj = scope.$eval(attrs.customPattern);

        ngModel.$validators.pattern = function (value) {
          var isValid = typeof value === 'string' && regexObj[0].test(value);
          return isValid;
        };

        var customValidityMessage = {
          pattern: regexObj[1],
          required: 'Please fill out this field.'
        };

        var validate = function () {
          var errorArray = Object.keys(ngModel.$error);
          var errorMessage = '';
          if (errorArray.length > 0) {
            errorMessage = customValidityMessage[errorArray[0]];
          }
          elem[0].setCustomValidity(errorMessage);
        };

        scope.$watch(attrs.ngModel, validate);
        elem[0].addEventListener('keyUp', validate);
      }
    };
  });
