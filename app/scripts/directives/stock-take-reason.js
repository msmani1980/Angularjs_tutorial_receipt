'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:stockTakeReason
 * @description
 * # stockTakeReason
 */
angular.module('ts5App').directive('stockTakeReason', function() {
  var stockTakeReasonController = function($scope, stockManagementStationItemsService, ngToast) {

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

    function showToastMessage(className, type, message) {
      hideLoadingModal();
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    $scope.stockTakeReasonOpen = function(stockItem, quantityType) {
      $scope.currentStockItem = angular.copy(stockItem);
      $scope.quantityType = quantityType;
      $scope.currentQuantity = ($scope.quantityType === 'Count' ? $scope.currentStockItem.currentQuantity : $scope.currentStockItem.ullageQuantity);
      $scope.newCount = null;
      $scope.newUllage = null;
      $scope.comment = null;
      $scope.stockAdjustmentReason = null;
      displayStockReasonModal();
    };

    $scope.clearScopeVars = function() {
      $scope.currentStockItem = null;
      $scope.quantityType = null;
      $scope.comment = null;
      $scope.newCount = null;
      $scope.newUllage = null;
      $scope.stockAdjustmentReason = null;
    };

    $scope.stockTakeReasonClose = function() {
      $scope.clearScopeVars();
      hideStockReasonModal();
    };

    function adjustStockResponse() {
      hideLoadingModal();
      showToastMessage('success', 'Stock Adjustment', 'successfully updated!');
      $scope.updateStockItems();
    }

    function createPayload() {
      return {
        id: $scope.currentStockItem.id,
        stationId: $scope.currentStockItem.stationId,
        itemMasterId: $scope.currentStockItem.itemMasterId,
        currentQuantity: ($scope.quantityType === 'Count' ? parseInt($scope.newCount) : $scope.currentStockItem.currentQuantity),
        ullageQuantity: ($scope.quantityType === 'Ullage' ? parseInt($scope.newCount) : $scope.currentStockItem.ullageQuantity),
        companyReasonCodeId: $scope.stockAdjustmentReason.id,
        note: $scope.comment
      };
    }

    $scope.stockTakeReasonSave = function() {
      var payload = createPayload();
      var _id = $scope.currentStockItem.id;
      $scope.clearScopeVars();
      hideStockReasonModal();
      displayLoadingModal('Updating item count');
      stockManagementStationItemsService.updateStockManagementStationItems(_id, payload).then(adjustStockResponse);
    };

  };

  return {
    templateUrl: '/views/directives/stock-take-reason.html',
    restrict: 'E',
    scope: false,
    controller: stockTakeReasonController
  };

});
