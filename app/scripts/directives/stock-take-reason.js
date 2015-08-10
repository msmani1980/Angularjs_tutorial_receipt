'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:stockTakeReason
 * @description
 * # stockTakeReason
 */
angular.module('ts5App')
  .directive('stockTakeReason', function() {
    var stockTakeReasonController = function($scope) {

      $scope.stockTakeReasonOpen = function(id) {

        $scope.id = id;

        var e = angular.element('#stock-take-reason');

        e.modal('show');

      };

      $scope.stockTakeReasonClose = function() {

        var e = angular.element('#stock-take-reason');

        e.modal('hide');

      };

    };

    return {
      templateUrl: '/views/directives/stock-take-reason.html',
      restrict: 'E',
      scope: false,
      controller: stockTakeReasonController

    };
  });
