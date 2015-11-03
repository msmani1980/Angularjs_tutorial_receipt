'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDiscrepancyDetail
 * @description
 * # ReconciliationDiscrepancyDetailCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDiscrepancyDetail', function ($scope, $routeParams, ngToast, $location, lodash) {

    $scope.showModal = function () {
      angular.element("#t6Modal").modal('show');
    };

    $scope.showEditViewForItem = function (item, isLMPStockItem) {
      if(isLMPStockItem) {
        return item.isEditing || $scope.editLMPStockTable;
      } else {
        return item.isEditing || $scope.editEposSalesTable;
      }
    };

    $scope.editLMPStockItem = function (item) {
      $scope.LMPStockRevisions = angular.copy($scope.LMPStock);
      item.isEditing = true;
      var duplicateItem = angular.copy(item);
      delete duplicateItem.revision;
      delete duplicateItem.isEditing;
      item.revision = duplicateItem;
    };

    $scope.saveLMPStockItem = function (item) {
      item.itemName = item.revision.itemName;
      item.dispatchedCount = item.revision.dispatchedCount;
      item.inboundCount = item.revision.inboundCount;
      item.ePOSSales = item.revision.ePOSSales;
      item.varianceQuantity = item.revision.varianceQuantity;
      item.retailValue = item.revision.varianceQuantity;
      item.varianceValue = item.revision.varianceValue;
      item.revision = {};
      item.isEditing = false;
    };

    $scope.revertLMPStockItem = function (item) {
      var duplicateItem = angular.copy(item);
      delete duplicateItem.revision;
      delete duplicateItem.isEditing;
      item.revision = duplicateItem;
    };

    $scope.cancelEditingLMPStockItem = function (item) {
      item.isEditing = false;
      $scope.revertLMPStockItem(item);
    };

    $scope.enableEditLMPStockTable = function () {
      $scope.editLMPStockTable = true;
      initRevisions();
    };

    $scope.saveLMPStockTable = function () {
      $scope.editLMPStockTable = false;
      angular.forEach($scope.LMPStock, function(item) {
        $scope.saveLMPStockItem(item);
      });
    };

    $scope.cancelEditingLMPStockTable = function () {
      $scope.editLMPStockTable = false;
    };

    $scope.updateLMPStockOrderBy = function (orderName) {
      if($scope.LMPSortTitle === orderName) {
        $scope.LMPSortTitle = '-' + $scope.LMPSortTitle;
      } else {
        $scope.LMPSortTitle = orderName;
      }
    };

    $scope.getLMPStockSortArrowType = function (orderName) {
      if($scope.LMPSortTitle === orderName) {
        return 'ascending';
      } else if($scope.LMPSortTitle === '-' + orderName) {
        return 'descending'
      }
      return 'none';
    };

    function initRevisions () {
      angular.forEach($scope.LMPStock, function (item) {
        item.revision = angular.copy(item);
        item.isEditing = false;
      });
    }

    function init() {
      angular.element("#checkbox").bootstrapSwitch();
      $scope.showLMPDiscrepancies = true;
      $scope.editLMPStockTable = false;
      $scope.editEposSalesTable = false;
      $scope.LMPSortTitle = 'itemName';

      $scope.LMPStock = [{
        itemName: 'Chocolate',
        itemDescription: 'Food: Chocolate',
        dispatchedCount: 50,
        inboundCount: 50,
        ePOSSales: 20,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 7.0,
        isDiscrepancy: true
      }, {
        itemName: 'Pepsi',
        itemDescription: 'Drink: Pepsi',
        dispatchedCount: 150,
        inboundCount: 30,
        ePOSSales: 25,
        varianceQuantity: 11,
        retailValue: 6,
        varianceValue: 12.0,
        isDiscrepancy: false
      }, {
        itemName: 'Coke',
        itemDescription: 'Drink: Coke',
        dispatchedCount: 20,
        inboundCount: 35,
        ePOSSales: 12,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 14.0,
        isDiscrepancy: false
      }];
      initRevisions();
    }
    init();

  });
