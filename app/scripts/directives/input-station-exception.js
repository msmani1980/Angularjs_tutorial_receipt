'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputStationException
 * @description
 * # inputStationException
 */
angular.module('ts5App')
  .directive('inputStationException', function () {

    var inputStationExceptionController = function ($scope, dateUtility) {
      $scope.isPriceActive = true;
      $scope.priceStartDate = '01/01/2001';
      $scope.$watch('priceStartDate', function () {
          $scope.isPriceActive = dateUtility.isTodayOrEarlierDatePicker($scope.priceStartDate);
        });
    };

    return {
      templateUrl: '/views/directives/input-station-exception.html',
      restrict: 'E',
      scope: true,
      link: function(scope) {
        scope.priceStartDate = scope.itemPrice.startDate;
      },

      controller: inputStationExceptionController
    };

  });
