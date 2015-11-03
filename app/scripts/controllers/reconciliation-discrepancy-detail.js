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

    $scope.editItem = function (item) {
      item.isEditing = true;
      var duplicateItem = angular.copy(item);
      delete duplicateItem.revision;
      delete duplicateItem.isEditing;
      item.revision = duplicateItem;
    };

    $scope.revertItem = function (item) {
      var duplicateItem = angular.copy(item);
      delete duplicateItem.revision;
      delete duplicateItem.isEditing;
      item.revision = duplicateItem;
    };

    $scope.cancelEditItem = function (item) {
      item.isEditing = false;
      item.revision = {};
    };

    $scope.saveItem = function (item) {
      angular.forEach(item, function (value, key) {
        if(key !== 'revision' && key !== 'isEditing') {
          item[key] = item.revision[key];
        }
      });
      item.revision = {};
      item.isEditing = false;
    };

    $scope.initEditLMPStockTable = function () {
      $scope.editLMPStockTable = true;
      initLMPStockRevisions();
    };

    $scope.editCashBagTable = function () {
      $scope.editCashBagTable = true;
      initCashBagRevisions();
    };

    $scope.saveLMPStockTable = function () {
      $scope.editLMPStockTable = false;
      angular.forEach($scope.LMPStock, function(item) {
        $scope.saveItem(item);
      });
    };

    $scope.saveCashBagTable = function () {

    };

    $scope.cancelEditingLMPStockTable = function () {
      $scope.editLMPStockTable = false;
      angular.forEach($scope.LMPStock, function(item) {
        item.revision = {};
        item.isEditing = false;
      });
    };

    $scope.cancelEditingCashBagTable  =function () {
    };

    $scope.updateLMPStockOrderBy = function (orderName) {
      if($scope.LMPSortTitle === orderName) {
        $scope.LMPSortTitle = '-' + $scope.LMPSortTitle;
      } else {
        $scope.LMPSortTitle = orderName;
      }
    };

    $scope.getArrowType = function (orderName, tableName) {
      if($scope.LMPSortTitle === orderName) {
        return 'ascending';
      } else if($scope.LMPSortTitle === '-' + orderName) {
        return 'descending'
      }
      return 'none';
    };

    function initLMPStockRevisions () {
      angular.forEach($scope.LMPStock, function (item) {
        item.revision = angular.copy(item);
        item.isEditing = false;
      });
    }

    function initCashBagRevisions () {

    }

    function initData() {
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
    }

    function initTableDefaults () {
      $scope.showLMPDiscrepancies = true;
      $scope.showCashBagDiscrepancies = true;
      $scope.editLMPStockTable = false;
      $scope.editCashBagTable = false;
      $scope.LMPSortTitle = 'itemName';
      $scope.stockSortTitle = 'cashBag';
    }

    function init() {
      angular.element("#checkbox").bootstrapSwitch();
      initTableDefaults();
      initData();
      initLMPStockRevisions();
      initCashBagRevisions();
    }
    init();

  });
