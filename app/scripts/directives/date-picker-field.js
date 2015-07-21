'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:datePickerField
 * @description
 * # datePickerField
 */
angular.module('ts5App')
  .directive('datePickerField', function (dateUtility) {
    return {
      templateUrl: '/views/directives/date-picker-field.html',
      restrict: 'E',
      scope: {
        ngModel: '=',
        name: '@',
        label: '@',
        required: '=',
        form: '=',
        disabled: '='
      },
      controller: function ($scope, $element) {
        var tomorrow = dateUtility.formatDateForApp(dateUtility.tomorrow(),
          'x');
        console.log(tomorrow);
        var datePickerOptions = {
          orientation: 'auto top',
          autoclose: true,
          startDate: tomorrow
        };
        this.init = function ($element) {
          var options = angular.extend({}, datePickerOptions);
          $element.find('input[type="text"]').datepicker(
            options);
        };
        this.init($element);
      }
    };
  });
