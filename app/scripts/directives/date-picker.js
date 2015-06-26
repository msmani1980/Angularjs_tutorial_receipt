'use strict';
/*global moment*/
/**
 * @ngdoc directive
 * @name ts5App.directive:datePicker
 * @description
 * # datePicker
 */
angular.module('ts5App')
  .directive('datePicker', function () {

    var datePickerOptions = {
      orientation: 'auto top',
      format: 'mm/dd/yyyy',
      autoclose: true,
      todayHighlight: true
    };

    var initializeDatePicker = function ($scope, $element) {
      var options = angular.extend({}, datePickerOptions);

      if ($scope.disablePast) {
        options.startDate = '+1d';
      } else if ($scope.minDate && !$scope.isSearchField) {
        options.startDate = moment($scope.minDate, 'L').format('L');
      }
      if ($scope.minDate) {
        options.startDate = $scope.minDate;
      }
      if ($scope.maxDate) {
        options.endDate = $scope.maxDate;
      }

      if ($scope.disableDateRange) {
        $element.find('.endDateContainer').remove();
      }

      if ($scope.shouldDisableStartDate) {
        $element.find('.endDate').datepicker(options);
        return false;
      }

      if ($scope.shouldDisableEndDate) {
        $element.find('.startDate').datepicker(options);
        return false;
      }

      $element.datepicker(options);
    };

    function link($scope, $element) {
      $scope.$watchGroup(['minDate', 'maxDate'], function () {
        if (!angular.isUndefined($scope.minDate)) {
          $element.find('.startDate').datepicker('setStartDate', $scope.minDate);
        }
        if (!angular.isUndefined($scope.maxDate)) {
          $element.find('.startDate').datepicker('setEndDate', $scope.maxDate);
        }
      });

      if ($scope.isSearchField) {
        initializeDatePicker($scope, $element);
        return false;
      }

      var watchListener = $scope.$watchGroup(['startDateModel', 'endDateModel'], function () {
        if (!$scope.isSearchField && $scope.disablePast && !angular.isUndefined($scope.startDateModel)) {
          // TODO: update to use isBefore and isAfter methods
          $scope.shouldDisableStartDate = moment($scope.startDateModel, 'L').format('L') < moment().format('L');
          $scope.shouldDisableEndDate = moment($scope.endDateModel, 'L').format('L') < moment().format('L');
          watchListener();
          initializeDatePicker($scope, $element);
        }
      });
    }

    return {
      templateUrl: '/views/directives/date-picker.html',
      restrict: 'E',
      replace: true,
      scope: {
        elementClass: '@',
        labelFrom: '@',
        labelTo: '@',
        disablePast: '@',
        disableStartDate: '=',
        disableEndDate: '=',
        disableDateRange: '@',
        isSearchField: '@',
        minDate: '=',
        maxDate: '=',
        startDateModel: '=',
        endDateModel: '=',
        required: '@'
      },
      link: link
    };
  });
