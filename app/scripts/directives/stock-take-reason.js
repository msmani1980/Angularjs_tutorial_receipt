'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:stockTakeReason
 * @description
 * # stockTakeReason
 */
angular.module('ts5App').directive('stockTakeReason', function () {
  var stockTakeReasonController = function ($scope, stockAdjustmentsService) {

    function displayStockReasonModal() {
      angular.element('#stock-take-reason').modal('show');
    }

    function hideStockReasonModal() {
      angular.element('#stock-take-reason').modal('hide');
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    $scope.stockTakeReasonOpen = function (stockitem) {
      $scope.id = stockitem.id;
      $scope.currentCount = stockitem.currentCount;
      $scope.newCount = null;
      $scope.masterItemId = stockitem.masterItemId;
      $scope.catererStationId = stockitem.catererStationId;
      $scope.comment = null;
      displayStockReasonModal();
    };

    $scope.clearScopeVars = function () {
      $scope.id = null;
      $scope.comment = null;
      $scope.currentCount = null;
      $scope.newCount = null;
      $scope.masterItemId = null;
      $scope.catererStationId = null;
    };

    $scope.stockTakeReasonClose = function () {
      $scope.clearScopeVars();
      hideStockReasonModal();
    };

    function adjustStockResponse(response) {
      if (!response) { // TODO - anything with response?
        return;
      }

      hideLoadingModal();
      // TODO - Possible to call controller logic from this directive?
      // TODO - Show success, with list of updated items
      // TODO - In controller - Refresh list view by re-querying the current caterer station
    }


    function createPayload() {
      return {
        catererStationId: $scope.catererStationId,
        masterItemId: $scope.masterItemId,
        quantity: parseInt($scope.newCount),
        companyReasonCodeId: $scope.stockAdjustmentReason[$scope.id].companyReasonTypeId,
        note: $scope.comment
      };
    }

    $scope.stockTakeReasonSave = function () {
      // TODO - Tests for everything after this comment
      // TODO - Validate comment field against acceptance criteria
      var payload = createPayload();
      $scope.clearScopeVars();
      hideStockReasonModal();
      displayLoadingModal('Saving');
      // TODO - handle error
      stockAdjustmentsService.adjustStock(payload).then(adjustStockResponse);
    };

  };

  return {
    templateUrl: '/views/directives/stock-take-reason.html',
    restrict: 'E',
    scope: false,
    controller: stockTakeReasonController
  };

});
