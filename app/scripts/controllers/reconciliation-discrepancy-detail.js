'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDiscrepancyDetail
 * @description
 * # ReconciliationDiscrepancyDetailCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDiscrepancyDetail', function ($q, $scope, $routeParams, $filter, reconciliationFactory, dateUtility, lodash) {

    var $this = this;

    function initLMPStockRevisions() {
      angular.forEach($scope.stockItemList, function (item) {
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

    function setStockItem(stockItem) {
      var newItem;
      var varianceQuantity = (stockItem.eposTotal || 0) - ( (stockItem.dispatchedQuantity + 0) - ((stockItem.inboundQuantity || 0) / (stockItem.offloadQuantity || 0)) ); // calculated as {ePOS Sales - [(LMP Dispatched Count + LMP Replenish Count) - LMP Incoming/Offload Count]}
      var retailValue = stockItem.price;
      var varianceValue = varianceQuantity * stockItem.price;
      var isDiscrepancy = (varianceQuantity !== 0);
      newItem = {
        itemName: stockItem.itemName,
        dispatchedCount: stockItem.dispatchedQuantity,
        replenishCount: 0,
        inboundCount: stockItem.inboundQuantity,
        offloadCount: stockItem.offloadQuantity,
        ePOSSales: $filter('currency')(stockItem.eposQuantity || 0, ''),
        varianceQuantity: $filter('currency')(varianceQuantity, ''),
        retailValue: $filter('currency')(retailValue, ''),
        varianceValue: $filter('currency')(varianceValue, ''),
        isDiscrepancy: isDiscrepancy
      };
      return newItem;
    }

    function mergeItems(rawItemList) {
      var inboundItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Warehouse Close'
          }).id;
      });

      var dispatchedItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Warehouse Open'
          }).id;
      });

      var offloadItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Offload'
          }).id;
      });

      inboundItemList.map(function (item) {
        item.inboundQuantity = item.quantity || 0;
        delete item.quantity;
      });

      dispatchedItemList.map(function (item) {
        item.dispatchedQuantity = item.quantity || 0;
        delete item.quantity;
      });

      offloadItemList.map(function (item) {
        item.offloadQuantity = item.quantity || 0;
        delete item.quantity;
      });

      return angular.merge(inboundItemList, dispatchedItemList, offloadItemList);
    }

    function setStockData(stockData) {
      var rawLMPStockData = angular.copy(stockData);
      var stockItemList = [];

      reconciliationFactory.getStoreInstanceItemList($routeParams.storeInstanceId).then(function (storeInstanceItemList) {
        var filteredItems = mergeItems(storeInstanceItemList.response);
        var mergedItemList = angular.merge(filteredItems, rawLMPStockData);
        angular.forEach(mergedItemList, function (stockItem) {
          stockItemList.push(setStockItem(stockItem));
        });
        $scope.stockItemList = stockItemList;
        initLMPStockRevisions();
      });
    }

    function getCashBagData() {
      reconciliationFactory.getCashBagMockData().then(function (dataFromAPI) {
        $scope.cashBags = angular.copy(dataFromAPI);
        initCashBagRevisions();
      });
    }

    function showLoadingModal(text) {
      $scope.displayError = false;
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function handleResponseError(responseFromAPI) {
      hideLoadingModal();
      $scope.errorResponse = angular.copy(responseFromAPI);
      $scope.displayError = true;
    }

    function getTotalsFor(stockTotals, itemTypeName) {
      var stockItem = $filter('filter')(stockTotals, {itemTypeName: itemTypeName});
      var totalLMP = 0;
      var totalEPOS = 0;
      angular.forEach(stockItem, function (item) {
        totalLMP += item.lmpTotal || 0;
        totalEPOS += item.eposTotal || 0;
      });

      return {
        totalLMP: $filter('currency')(totalLMP, ''),
        totalEPOS: $filter('currency')(totalEPOS, '')
      };
    }

    function getTotalsForPromotions(promotionTotals) {
      var total = 0;
      promotionTotals.map(function (promotionItem) {
        total += promotionItem.convertedAmount;
      });

      return {
        totalLMP: $filter('currency')(total, ''),
        totalEPOS: $filter('currency')(total, '')
      };
    }

    function setDiscrepancy() {
      var netValue = parseFloat($scope.stockTotals.totalNet.netEPOS) - parseFloat($scope.stockTotals.totalNet.netLMP);
      var netPercentage = netValue / parseFloat($scope.stockTotals.totalNet.netEPOS);
      var revenueValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.totalRevenue.epos);
      var revenuePercentage = revenueValue / parseFloat($scope.stockTotals.totalNet.netEPOS);
      $scope.discrepancy = {
        net: {
          value: netValue,
          percentage: netPercentage
        },
        revenue: {
          value: revenueValue,
          percentage: revenuePercentage
        },
        exchange: {
          value: 0,
          percentage: 0
        },
        total: {
          value: 0,
          percentage: 0
        }
      };
    }

    function setNetTotals(stockData) {
      var stockTotals = angular.copy(stockData);
      angular.forEach(stockTotals, function (stockItem) {
        stockItem.parsedLMP = parseFloat(stockItem.totalLMP);
        stockItem.parsedEPOS = parseFloat(stockItem.totalEPOS);
      });

      var netLMP = stockTotals.totalRetail.parsedLMP + stockTotals.totalVirtual.parsedLMP + stockTotals.totalVoucher.parsedLMP - stockTotals.totalPromotion.parsedLMP;
      var netEPOS = stockTotals.totalRetail.parsedEPOS + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher.parsedEPOS - stockTotals.totalPromotion.parsedEPOS;

      var netTotals = {
        netLMP: $filter('currency')(netLMP, ''),
        netEPOS: $filter('currency')(netEPOS, '')
      };
      $scope.stockTotals = angular.extend(stockTotals, {totalNet: netTotals});
    }

    function getEPOSRevenue(eposRevenue) {
      var eposCashBag = eposRevenue[0].response;
      var eposCreditCard = eposRevenue[1].response;
      var eposDiscount = eposRevenue[2].response;
      var total = 0;

      angular.forEach(eposCashBag, function (cashBag) {
        if (cashBag.bankAmount) {
          total += cashBag.bankAmount;
        } else if (cashBag.coinAmountManual && cashBag.paperAmountManual) {
          total += cashBag.coinAmountManual;
          total += cashBag.paperAmountManual;
        }
      });

      angular.forEach(eposCreditCard, function (creditCard) {
        if (creditCard.bankAmountFinal) {
          total += creditCard.bankAmountFinal;
        }
      });

      angular.forEach(eposDiscount, function (discount) {
        if (discount.bankAmountFinal) {
          total += discount.bankAmountFinal;
        }
      });
      return total;
    }

    function getCHRevenue(chRevenue) {
      var chCashBag = chRevenue[0].response;
      var chCreditCard = chRevenue[1].response;
      var chDiscount = chRevenue[2].response;
      var total = 0;

      angular.forEach(chCashBag, function (cashBag) {
        if (cashBag.bankAmountCh) {
          total += cashBag.bankAmountCh;
        } else if (cashBag.coinAmountManualCh && cashBag.paperAmountManualCh) {
          total += cashBag.coinAmountManualCh;
          total += cashBag.paperAmountManualCh;
        }
      });

      angular.forEach(chCreditCard, function (creditCard) {
        if (creditCard.bankAmountFinal) {
          total += creditCard.bankAmountFinal;
        } else if (creditCard.coinAmountManualCc && creditCard.paperAmountManualCc) {
          total += creditCard.coinAmountManualCc;
          total += creditCard.paperAmountManualCc;
        }
      });

      angular.forEach(chDiscount, function (discount) {
        if (discount.bankAmountFinal) {
          total += discount.bankAmountFinal;
        } else if (discount.coinAmountManualCc && discount.paperAmountManualCc) {
          total += discount.coinAmountManualCc;
          total += discount.paperAmountManualCc;
        }
      });
      return total;
    }

    function setupData(responseCollection) {
      $this.itemTypes = angular.copy(responseCollection[0]);
      $this.countTypes = angular.copy(responseCollection[1]);
      var stockTotals = angular.copy(responseCollection[2].response);
      var promotionTotals = angular.copy(responseCollection[3].response);
      var chRevenue = angular.copy(responseCollection[4]);
      var eposRevenue = angular.copy(responseCollection[5]);

      $scope.totalRevenue = {
        cashHandler: $filter('currency')(getCHRevenue(chRevenue), ''),
        epos: $filter('currency')(getEPOSRevenue(eposRevenue), '')
      };

      stockTotals.map(function (stockItem) {
        stockItem.itemTypeName = lodash.findWhere($this.itemTypes, {id: stockItem.itemTypeId}).name;
      });

      var totalItems = getTotalsFor(stockTotals, 'Regular');
      var totalVirtual = getTotalsFor(stockTotals, 'Virtual');
      var totalVoucher = getTotalsFor(stockTotals, 'Voucher');
      var totalPromotion = getTotalsForPromotions(promotionTotals);

      var stockObject = {
        totalRetail: totalItems,
        totalVirtual: totalVirtual,
        totalVoucher: totalVoucher,
        totalPromotion: totalPromotion
      };

      setNetTotals(stockObject);
      setStockData(stockTotals);
      setDiscrepancy();
    }

    function initData() {
      var promiseArray = [];
      promiseArray.push(reconciliationFactory.getItemTypesList());
      promiseArray.push(reconciliationFactory.getCountTypes());
      promiseArray.push(reconciliationFactory.getStockTotals($routeParams.storeInstanceId));
      promiseArray.push(reconciliationFactory.getPromotionTotals($routeParams.storeInstanceId));
      promiseArray.push(reconciliationFactory.getCHRevenue($routeParams.storeInstanceId));
      promiseArray.push(reconciliationFactory.getEPOSRevenue($routeParams.storeInstanceId));
      $q.all(promiseArray).then(setupData);
      getCashBagData();
    }

    function formatDates(storeInstanceData) {
      storeInstanceData.scheduleDate = dateUtility.formatDateForApp(storeInstanceData.scheduleDate);
      return storeInstanceData;
    }

    function getStoreInstanceDetailsSuccessHandler(storeInstanceDataFromAPI) {
      hideLoadingModal();
      $scope.storeInstance = formatDates(angular.copy(storeInstanceDataFromAPI));
      initData();
    }

    function initTableDefaults() {
      $scope.showLMPDiscrepancies = true;
      $scope.showCashBagDiscrepancies = true;
      $scope.editLMPStockTable = false;
      $scope.editCashBagTable = false;
      $scope.LMPSortTitle = 'itemName';
      $scope.cashBagSortTitle = 'cashBag';
      $scope.cashBagFilter = {};
    }

    function init() {
      showLoadingModal('Loading Reconciliation Discrepancy Details');
      reconciliationFactory.getStoreInstanceDetails($routeParams.storeInstanceId).then(getStoreInstanceDetailsSuccessHandler, handleResponseError);
      angular.element('#checkbox').bootstrapSwitch();
      initTableDefaults();
    }

    $scope.showModal = function (modalName) {
      angular.element('#t6Modal').modal('show');
      var modalNameToHeaderMap = {
        'Virtual': 'Virtual Product Revenue',
        'Voucher': 'Voucher Product Revenue',
        'Promotion': 'ePOS Discount'
      };
      var modalNamToTableHeaderMap = {
        'Virtual': 'Virtual Product Name',
        'Voucher': 'Voucher Product Name',
        'Promotion': 'Promotion Name'
      };
      if (modalNameToHeaderMap[modalName] && modalNamToTableHeaderMap[modalName]) {
        $scope.modalMainTitle = modalNameToHeaderMap[modalName];
        $scope.modalTableHeader = modalNamToTableHeaderMap[modalName];
      }
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
      if (isLMPTable) {
        $scope.editLMPStockTable = true;
        initLMPStockRevisions();
      } else {
        $scope.editCashBagTable = true;
        initCashBagRevisions();
      }
    };

    $scope.saveTable = function (isLMPTable) {
      var dataList;
      if (isLMPTable) {
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
      if (isLMPTable) {
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
        return 'descending';
      }
      return 'none';
    };

    init();

  });
