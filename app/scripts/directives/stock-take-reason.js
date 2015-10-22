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

    $scope.stockTakeReasonOpen = function(stockitem) {
      $scope.id = stockitem.id;
      $scope.currentCountQuantity = stockitem.currentQuantity;
      $scope.currentUllageQuantity = stockitem.ullageQuantity;
      $scope.newCount = null;
      $scope.newUllage = null;
      $scope.masterItemId = stockitem.itemMasterId;
      $scope.catererStationId = stockitem.stationId;
      $scope.comment = null;
      displayStockReasonModal();
    };

    $scope.clearScopeVars = function() {
      $scope.id = null;
      $scope.comment = null;
      $scope.currentCountQuantity = null;
      $scope.ullageQuantity = null;
      $scope.newCount = null;
      $scope.newUllage = null;
      $scope.masterItemId = null;
      $scope.catererStationId = null;
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
        stationId: $scope.catererStationId,
        itemMasterId: $scope.masterItemId,
        currentQuantity: parseInt($scope.newCount),
        ullageQuantity: $scope.currentUllageQuantity,
        companyReasonCodeId: $scope.stockAdjustmentReason.id,
        note: $scope.comment
      };
    }

    $scope.stockTakeReasonSave = function() {
      var payload = createPayload();
      var _id = $scope.id;
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
