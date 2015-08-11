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

      $scope.comment = '';

      $scope.stockTakeReasonOpen = function(id, currentCount) {
        $scope.id = id;
        $scope.currentCount = currentCount;

        var e = angular.element('#stock-take-reason');

        e.modal('show');

      };

      $scope.stockTakeReasonClose = function() {
        $scope.id = null;
        $scope.comment = null;
        $scope.currentCount = null;

        var e = angular.element('#stock-take-reason');

        e.modal('hide');

      };

      $scope.stockTakeReasonSave = function() {
        $scope.id = null;
        $scope.comment = null;
        $scope.currentCount = null;

        var e = angular.element('#stock-take-reason');

        e.modal('hide');

        var dummy = angular.element('#stock-take-reason-dummy');

        dummy.modal('show');

      };

    };

    return {
      templateUrl: '/views/directives/stock-take-reason.html',
      restrict: 'E',
      scope: false,
      controller: stockTakeReasonController

    };
  });
