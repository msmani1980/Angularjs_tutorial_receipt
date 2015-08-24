'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:stockTakeReason
 * @description
 * # stockTakeReason
 */
angular.module('ts5App').directive('stockTakeReason', function() {
  var stockTakeReasonController = function($scope, stockAdjustmentsService, ngToast) {

    function showToastMessage(className, type, message) {
      hideLoadingModal();
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

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

    $scope.stockTakeReasonOpen = function(stockitem) {
      $scope.id = stockitem.id;
      $scope.currentCountQuantity = stockitem.currentCountQuantity;
      $scope.newCount = null;
      $scope.masterItemId = stockitem.masterItemId;
      $scope.catererStationId = stockitem.catererStationId;
      $scope.comment = null;
      displayStockReasonModal();
    };

    $scope.clearScopeVars = function() {
      $scope.id = null;
      $scope.comment = null;
      $scope.currentCountQuantity = null;
      $scope.newCount = null;
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
        catererStationId: $scope.catererStationId,
        masterItemId: $scope.masterItemId,
        quantity: parseInt($scope.newCount),
        companyReasonCodeId: $scope.stockAdjustmentReason.id,
        note: $scope.comment
      };
    }

    $scope.stockTakeReasonSave = function() {
      var payload = createPayload();
      $scope.clearScopeVars();
      hideStockReasonModal();
      displayLoadingModal('Updating item count');
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
