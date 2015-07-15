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
        required: '='
      },
      controller: function ($scope, $element) {
        var datePickerOptions = {
          orientation: 'auto top',
          autoclose: true,
          todayHighlight: true,
          startDate: dateUtility.nowFormatted()
        };
        this.init = function ($element) {
          var options = angular.extend({}, datePickerOptions);
          $element.find('input[type="text"]').datepicker(options);
        };
        this.init($element);
      }
    };
  });
