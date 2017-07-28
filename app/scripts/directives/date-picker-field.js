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
        name: '@',
        label: '@',
        orientation: '=',
        required: '=',
        form: '=',
        disable: '=',
        disablePast: '=',
        minDate: '=',
        maxDate: '=',
        grayPast: '='
      },
      controller: function($scope, $element) {
        var datePickerOptions = {
          orientation: 'auto top',
          format: companyFormatUtility.getDateFormat().toLowerCase(),
          autoclose: true,
          todayHighlight: true,
          maxDate: $scope.maxDate
        };

        $scope.placeholder = datePickerOptions.format;

        if ($scope.minDate && !$scope.disable) {
          datePickerOptions.startDate = $scope.minDate;
        }

        if ($scope.grayPast) {
          datePickerOptions.beforeShowDay = function (date) {
            var formattedDate =  dateUtility.formatDate(date, null, dateUtility.getDateFormatForApp());
            var isBeforeToday = dateUtility.isYesterdayOrEarlier(formattedDate);

            return isBeforeToday ? 'gray-out' : '';
          };
        }

        if ($scope.orientation) {
          datePickerOptions.orientation = $scope.orientation;
        }

        this.init = function($scope, $element) {
          var options = angular.extend({}, datePickerOptions);
          var datePickerInput = $element.find('input[type="text"]');
          datePickerInput.datepicker(options);
          datePickerInput.datepicker('setDate', $scope.ngModel);
          $scope.$watch('ngModel', function(newData, oldData) {
            if ($scope.ngModel && newData !== oldData) {
              datePickerInput.datepicker('setDate', $scope.ngModel);
            }
          });
        };

        this.init($scope, $element);
      }
    };
  });
