'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:datePickerField
 * @description
 * # datePickerField
 */
angular.module('ts5App')
  .directive('datePickerField', function(companyFormatUtility, dateUtility) {
    return {
      templateUrl: '/views/directives/date-picker-field.html',
      restrict: 'E',
      scope: {
        ngModel: '=',
        ngChange: '=',
        name: '@',
        label: '@',
        orientation: '=',
        required: '=',
        form: '=',
        disable: '=',
        disablePast: '=',
        minDate: '=',
        maxDate: '=',
        grayPast: '=',
        customDate: '=',
        customEffective: '=',
        endCurrentEffective: '=',
        startDate: '=',
        endDate: '='
      },
      controller: function($scope, $element) {
        var datePickerOptions = {
          orientation: 'auto top',
          format: companyFormatUtility.getDateFormat().toLowerCase(),
          autoclose: true,
          todayHighlight: false
        };

        $scope.placeholder = datePickerOptions.format;

        if ($scope.minDate && !$scope.disable) {
          datePickerOptions.startDate = $scope.minDate;
        }

        if ($scope.endDate) {
          datePickerOptions.endDate = $scope.endDate;
        }

        if ($scope.grayPast) {
          datePickerOptions.beforeShowDay = function (date) {
            var formattedDate =  dateUtility.formatDatePicker(date, null, dateUtility.getDateFormatForApp());
            var isBeforeToday = dateUtility.isYesterdayOrEarlierDatePicker(formattedDate);

            return isBeforeToday ? 'gray-out' : '';
          };
        }

        if ($scope.orientation) {
          datePickerOptions.orientation = $scope.orientation;
        }

        this.init = function($scope, $element) {
          var options = angular.extend({}, datePickerOptions);

          if ($scope.startDate) {
            options.startDate = $scope.startDate;
          } else if (!$scope.customEffective && !$scope.endCurrentEffective) {
            options.startDate = ($scope.customDate !== null && $scope.customDate !== undefined) ? $scope.customDate : dateUtility.tomorrowFormattedDatePicker();
          } else if ($scope.endCurrentEffective) {
            options.startDate = dateUtility.nowFormattedDatePicker();
          }

          var datePickerInput = $element.find('input[type="text"]');

          datePickerInput.datepicker(options);
          datePickerInput.datepicker('update', $scope.ngModel);

          $scope.$watch('ngModel', function(newData, oldData) {
            if ($scope.ngModel && (newData !== oldData)) {
              datePickerInput.datepicker('setDate', $scope.ngModel);
            }
          });
        };

        this.init($scope, $element);
      }
    };
  });
