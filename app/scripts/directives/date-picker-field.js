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
        disabled: '=',
        disablePast: '=',
        minDate: '=',
        maxDate: '='
      },
      controller: function ($scope, $element) {
        var today = dateUtility.nowFormatted();
        var startDate = ( $scope.minDate ? $scope.minDate : today );
        if ($scope.disablePast) {
          startDate = '+1d';
        }
        var datePickerOptions = {
          orientation: 'auto top',
          autoclose: true,
          startDate: startDate,
          maxDate: $scope.maxDate
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
