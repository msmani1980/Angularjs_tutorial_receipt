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

    return {
      templateUrl: 'views/directives/date-picker.html',
      restrict: 'E',
      replace: true,
      scope: {
        elementClass: '@',
        labelFrom: '@',
        labelTo: '@',
        disablePreviousDate: '@',
        disableStartDate: '@',
        disableEndDate: '@',
        startDateModel: '=',
        endDateModel: '='
      },
      controller: function ($scope, $element, $attrs) {
        $element.datepicker({
          onSelect: function (dateText) {
            console.log(dateText);
          }
        });

        $scope.$watchGroup(['startDateModel', 'endDateModel'], function () {
          if ($scope.disablePreviousDate) {
            $scope.shouldDisableStartDate = moment($scope.startDateModel, 'L').format('L') < moment().format('L');
            $scope.shouldDisableEndDate = moment($scope.endDateModel, 'L').format('L') < moment().format('L');
          }
        });
      }
    };
  });
