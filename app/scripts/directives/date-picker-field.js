'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:datePickerField
 * @description
 * # datePickerField
 */
angular.module('ts5App')
  .directive('datePickerField', function () {
    return {
      templateUrl: '/views/directives/date-picker-field.html',
      restrict: 'E',
      scope: {
        ngModel: '=',
        name: '@',
        label: '@',
        required: '=',
        form: '=',
        disable: '=',
        disablePast: '=',
        minDate: '=',
        maxDate: '='
      },
      controller: function ($scope, $element) {
        var datePickerOptions = {
          orientation: 'auto top',
          autoclose: true,
          maxDate: $scope.maxDate
        };
        if($scope.minDate) {
          datePickerOptions.startDate = $scope.minDate;
        }
        this.init = function ($scope, $element) {
          var options = angular.extend({}, datePickerOptions);
          var datePickerInput = $element.find('input[type="text"]');
          datePickerInput.datepicker(options);
          $scope.$watch('ngModel', function () {
            if($scope.ngModel) {
              datePickerInput.datepicker('setDate', $scope.ngModel);
            }
          });
        };
        this.init($scope, $element);
      }
    };
  });
