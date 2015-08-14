'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:stockTakeReason
 * @description
 * # stockTakeReason
 */
angular.module('ts5App')
  .directive('stockTakeReason', function() {
    var stockTakeReasonController = function($scope, stockAdjustmentsService) {

      $scope.stockTakeReasonOpen = function(id, currentCount, masterItemId, catererStationId) {
        $scope.id = id;
        $scope.currentCount = currentCount;
        $scope.newCount = null;
        $scope.masterItemId = masterItemId;
        $scope.catererStationId = catererStationId;
        $scope.comment = null;
        var e = angular.element('#stock-take-reason');
        e.modal('show');
      };

      $scope.clearScopeVars = function(){
        $scope.id = null;
        $scope.comment = null;
        $scope.currentCount = null;
        $scope.newCount = null;
        $scope.masterItemId = null;
        $scope.catererStationId = null;
      };

      $scope.stockTakeReasonClose = function() {
        $scope.clearScopeVars();

        var e = angular.element('#stock-take-reason');
        e.modal('hide');
      };

      function adjustStockResponse(response){
        if(!response){ // TODO - anything with response?
          return;
        }

        hideLoadingModal();
        // TODO - Possible to call controller logic from this directive?
        // TODO - Show success, with list of updated items
        // TODO - In controller - Refresh list view by re-querying the current caterer station
      }

      $scope.stockTakeReasonSave = function() {
        // TODO - Tests for everything after this comment
        // TODO - Validate comment field against acceptance criteria
        var payload = {
          catererStationId: $scope.catererStationId,
          masterItemId : $scope.masterItemId,
          quantity: parseInt($scope.newCount),
          companyReasonCodeId: $scope.stockAdjustmentReason[$scope.id].companyReasonTypeId,
          note: $scope.comment
        };
        $scope.clearScopeVars();
        var e = angular.element('#stock-take-reason');
        e.modal('hide');
        displayLoadingModal('Saving');
        // TODO - handle error
        stockAdjustmentsService.adjustStock(payload).then(adjustStockResponse);
      };


      function displayLoadingModal(loadingText) {
        angular.element('#loading').modal('show').find('p').text(loadingText);
      }

      function hideLoadingModal() {
        angular.element('#loading').modal('hide');
      }

    };

    return {
      templateUrl: '/views/directives/stock-take-reason.html',
      restrict: 'E',
      scope: false,
      controller: stockTakeReasonController

    };
  });
