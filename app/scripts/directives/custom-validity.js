'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:customValidity
 * @description
 * # inputField
 */
angular.module('ts5App')
  .directive('customValidity', function($filter) {
    var patternsJSON = {
      word: [/^[\w\s]+$/, 'Error message for word'],
      bit: [/^(0|1)$/, 'Error message for bit'],
      number: [/^([0-9]*)$/, 'Error message for number'],
      numberUpToFiveChars: [/^-?([0-9]{0,5})$/, 'This field can only contain numbers with up to 5 digits'],
      alpha: [/^[a-zA-z]+$/, 'Error message for alpha'],
      alphanumeric: [/^[a-zA-Z0-9]+$/, 'Error message for alphanumeric'],
      alphanumericUpToTenChars: [/^[a-zA-Z0-9]{1,10}$/,
        'Must be 1 to 10 characters long, number and letters only. Spaces are not allowed.'
      ],
      email: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Error message for email'],
      phone: [/^([0-9]{3}( |-|.)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-|.)?([0-9]{3}( |-|.)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
        'Error message for phone'
      ],
      cc: [
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        'Error message for cc'
      ],
      zip: [/^(([0-9]{5})|([0-9]{5}[-][0-9]{4}))$/, 'Error message for zip'],
      decimal: [/^\d+\.\d{0,4}$/, 'Error message for decimal'],
      currencyWithFourDecimalPlace: [/^\d+\.\d{4}$/, 'This field should use format 0.0000', 4],
      currencyWithThreeDecimalPlace: [/^\d+\.?\d{0,3}$/, 'This field should use format 0.000', 3],
      currencyWithTwoDecimalPlace: [/^\d+\.\d{2}$/, 'This field should use format 0.00', 2],
      price: [/^\$?\s?[0-9\,]+(\.\d{0,4})?$/, 'Error message for price'],
      url: [/(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,
        'Error for URL'
      ],
      time: [/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$/,
        'This field should use 24 hour time format (hh:mm) or (hh:mm:ss)'
      ],
      percentage: [/^[-+]?([0-9]\d?(\.\d{1,2})?|0\.(\d?[1-9]|[1-9]\d))$|^100$/,
        'This field should use percentage format 0-100'
      ]
    };
    return {
      restrict: 'A',
      require: '^ngModel',
      scope: true,
      transclude: true,
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        var regexObj = patternsJSON[attrs.customPattern];

        ngModel.$validators.pattern = function(value) {
          return (typeof value === 'string' && regexObj[0].test(value));
        };

        if (attrs.customPattern.contains('currency')) {
          ngModel.$formatters.push(function(value) {
            return $filter('number')(value, regexObj[2]);
          });
        }

        var customValidityMessage = {
          pattern: regexObj[1],
          required: 'Please fill out this field.'
        };

        var validate = function() {
          var errorArray = Object.keys(ngModel.$error);
          var errorMessage = '';
          if (errorArray.length > 0) {
            errorMessage = customValidityMessage[errorArray[0]];
          }
          element[0].setCustomValidity(errorMessage);
        };

        scope.$watch(attrs.ngModel, validate);
        element[0].addEventListener('keyUp', validate);
      }
    };
  });
