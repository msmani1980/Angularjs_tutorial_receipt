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
      if (isLMPStockItem) {
        return item.isEditing || $scope.editLMPStockTable;
      } else {
        return item.isEditing || $scope.editCashBagTable;
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
        if (key !== 'revision' && key !== 'isEditing') {
          item[key] = item.revision[key];
        }
      });
      item.revision = {};
      item.isEditing = false;
    };

    $scope.initEditTable = function (isLMPTable) {
      if(isLMPTable) {
        $scope.editLMPStockTable = true;
        initLMPStockRevisions();
      } else {
        $scope.editCashBagTable = true;
        initCashBagRevisions();
      }
    };

    $scope.saveTable = function (isLMPTable) {
      var dataList;
      if(isLMPTable) {
        $scope.editLMPStockTable = false;
        dataList = $scope.LMPStock;
      } else {
        $scope.editCashBagTable = false;
        dataList = $scope.cashBags;
      }
      angular.forEach(dataList, function (item) {
        $scope.saveItem(item);
      });
    };

    $scope.cancelEditingTable = function (isLMPTable) {
      var dataList;
      if(isLMPTable) {
        $scope.editLMPStockTable = false;
        dataList = $scope.LMPStock;
      } else {
        $scope.editCashBagTable = false;
        dataList = $scope.cashBags;
      }
      angular.forEach(dataList, function (item) {
        item.revision = {};
        item.isEditing = false;
      });
    };


    $scope.updateOrderBy = function (orderName, isLMPStock) {
      var currentTitle = isLMPStock ? $scope.LMPSortTitle : $scope.cashBagSortTitle;
      var titleToSet = (currentTitle === orderName) ? ('-' + currentTitle) : (orderName);

      if (isLMPStock) {
        $scope.LMPSortTitle = titleToSet;
      } else {
        $scope.cashBagSortTitle = titleToSet;
      }
    };

    $scope.getArrowType = function (orderName, isLMPStock) {
      var currentTitle = isLMPStock ? $scope.LMPSortTitle : $scope.cashBagSortTitle;
      if (currentTitle === orderName) {
        return 'ascending';
      } else if (currentTitle === '-' + orderName) {
        return 'descending'
      }
      return 'none';
    };

    function initLMPStockRevisions() {
      angular.forEach($scope.LMPStock, function (item) {
        item.revision = angular.copy(item);
        item.isEditing = false;
      });
    }

    function initCashBagRevisions() {
      angular.forEach($scope.cashBags, function (item) {
        item.revision = angular.copy(item);
        item.isEditing = false;
      });
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
      $scope.cashBags = [{
        cashBag: 'CB123',
        currency: 'GBP',
        exchangeAmount: 12,
        crewAmount: 14,
        paperAmount: 34,
        coinAmount: 12.00,
        varianceValue: 5,
        bankExchangeRate: 7.0,
        totalBand: 100,
        isDiscrepancy: true
      }, {
        cashBag: 'CB345',
        currency: 'GBP',
        exchangeAmount: 15,
        crewAmount: 34,
        paperAmount: 23,
        coinAmount: 15.00,
        varianceValue: 12,
        bankExchangeRate: 16.0,
        totalBand: 200,
        isDiscrepancy: false
      }];
    }

    function initTableDefaults() {
      $scope.showLMPDiscrepancies = true;
      $scope.showCashBagDiscrepancies = true;
      $scope.editLMPStockTable = false;
      $scope.editCashBagTable = false;
      $scope.LMPSortTitle = 'itemName';
      $scope.cashBagSortTitle = 'cashBag';
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
