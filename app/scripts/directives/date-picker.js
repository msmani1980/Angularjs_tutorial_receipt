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

      if ($scope.disableDateRange) {
        $element.find('.endDate').remove();
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

      //$element.on('changeDate', '.startDate', function (startDateEvent) {
      //  console.log('startDate', startDateEvent.date);
      //});
      //$element.on('changeDate', '.endDate', function (endDateEvent) {
      //  console.log('endDate', endDateEvent.date);
      //});
    };

    function link($scope, $element) {

      var watchListener = $scope.$watchGroup(['startDateModel', 'endDateModel'], function () {
        if ($scope.disablePast && !angular.isUndefined($scope.startDateModel)) {
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
        disabled: '@',
        disableDateRange: '@',
        minDate: '@',
        maxDate: '@',
        startDateModel: '=',
        endDateModel: '='
      },
      link: link
    };
  });
