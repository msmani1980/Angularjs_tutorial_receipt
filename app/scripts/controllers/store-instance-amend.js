'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceAmendCtrl
 * @description
 * # StoreInstanceAmendCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceAmendCtrl', function ($q, $scope, $routeParams, $filter, reconciliationFactory, currencyFactory, GlobalMenuService, dateUtility, lodash) {
    var $this = this;

    function formatAsCurrency(valueToFormat) {
      return $filter('currency')(valueToFormat, '');
    }

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

    function getVarianceQuantity(stockItem) {
      var eposSales = stockItem.eposTotal;
      var lmpDispatchedCount = stockItem.dispatchedQuantity;
      var lmpReplenishCount = 0;
      var lmpIncomingCount = stockItem.inboundQuantity;
      var offloadCount = stockItem.offloadQuantity;
      return eposSales - ((lmpDispatchedCount + lmpReplenishCount) - lmpIncomingCount / offloadCount);
    }

    function setStockItem(stockItem) {
      var varianceQuantity = getVarianceQuantity(stockItem);
      var retailValue = stockItem.price;
      var varianceValue = varianceQuantity * stockItem.price;
      var isDiscrepancy = (varianceQuantity !== 0);

      return {
        itemName: stockItem.itemName,
        dispatchedCount: stockItem.dispatchedQuantity,
        replenishCount: 0,
        inboundCount: stockItem.inboundQuantity,
        offloadCount: stockItem.offloadQuantity,
        ePOSSales: formatAsCurrency(stockItem.eposQuantity),
        varianceQuantity: formatAsCurrency(varianceQuantity),
        retailValue: formatAsCurrency(retailValue),
        varianceValue: formatAsCurrency(varianceValue),
        isDiscrepancy: isDiscrepancy
      };
    }

    function mergeItems(itemListFromAPI) {
      var rawItemList = angular.copy(itemListFromAPI);
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

      angular.forEach(inboundItemList, function (item) {
        item.inboundQuantity = item.quantity || 0;
        delete item.quantity;
      });

      angular.forEach(dispatchedItemList, function (item) {
        item.dispatchedQuantity = item.quantity || 0;
        delete item.quantity;
      });

      angular.forEach(offloadItemList, function (item) {
        item.offloadQuantity = item.quantity || 0;
        delete item.quantity;
      });

      return angular.merge(inboundItemList, dispatchedItemList, offloadItemList);
    }

    function setStockItemList(storeInstanceItemList, rawLMPStockData) {
      var filteredItems = mergeItems(storeInstanceItemList.response);
      var mergedItemList = angular.merge(filteredItems, rawLMPStockData);
      $scope.stockItemList = lodash.map(mergedItemList, setStockItem);
      initLMPStockRevisions();
    }

    function setStockData(stockData) {
      var rawLMPStockData = angular.copy(stockData);

      reconciliationFactory.getStoreInstanceItemList($routeParams.storeInstanceId).then(function (storeInstanceItemList) {
        setStockItemList(storeInstanceItemList, rawLMPStockData);
      }, handleResponseError);
    }

    function getCurrencyByBaseCurrencyId(currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    }

    function formatCashBags(cashHandlerCashBagList) {
      var formattedCashBagList = [];
      angular.forEach(cashHandlerCashBagList, function (cashBag) {
        cashBag.currencyObject = getCurrencyByBaseCurrencyId($this.globalCurrencyList, cashBag.retailCompanyCurrency);

        var crewAmount = cashBag.paperAmountEpos + cashBag.coinAmountEpos;
        var varianceValue = (cashBag.paperAmountManual + cashBag.coinAmountManual) - crewAmount + (crewAmount - 0);
        var isDiscrepancy = varianceValue !== 0;
        var bankExchangeRate = cashBag.chBankExchangeRate || (cashBag.chPaperExchangeRate + '/' + cashBag.chCoinExchangeRate);
        var totalBank = cashBag.bankAmountCh || (cashBag.coinAmountManualCh + cashBag.paperAmountManualCh);
        var cashBagItem = {
          cashBagNumber: cashBag.cashbagNumber,
          currency: cashBag.currencyObject.currencyCode,
          eposCalculatedAmount: '-',
          crewAmount: formatAsCurrency(crewAmount),
          paperAmount: formatAsCurrency(cashBag.paperAmountManual),
          coinAmount: formatAsCurrency(cashBag.coinAmountManual),
          varianceValue: formatAsCurrency(varianceValue),
          bankExchangeRate: bankExchangeRate,
          totalBank: formatAsCurrency(totalBank),
          isDiscrepancy: isDiscrepancy
        };
        formattedCashBagList.push(cashBagItem);
      });
      $scope.cashBags = formattedCashBagList;
    }

    function getCashBagData() {
      formatCashBags($this.chCashBag);
      initCashBagRevisions();
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
        totalLMP: formatAsCurrency(totalLMP),
        totalEPOS: formatAsCurrency(totalEPOS)
      };
    }

    function getTotalsForPromotions(promotionTotals) {
      var total = lodash.reduce(promotionTotals, function (total, promotionItem) {
        return total + promotionItem.convertedAmount;
      });

      return {
        totalLMP: formatAsCurrency(total),
        totalEPOS: formatAsCurrency(total)
      };
    }

    function setDiscrepancy() {
      var netValue = parseFloat($scope.stockTotals.totalNet.netEPOS) - parseFloat($scope.stockTotals.totalNet.netLMP);
      var netPercentage = netValue / parseFloat($scope.stockTotals.totalNet.netEPOS);

      var revenueValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.stockTotals.totalNet.epos);
      var revenuePercentage = revenueValue / parseFloat($scope.stockTotals.totalNet.netEPOS);

      var exchangeValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.totalRevenue.epos);
      var exchangePercentage = exchangeValue / parseFloat($scope.stockTotals.totalNet.netEPOS);

      var totalValue = netValue + revenueValue + exchangeValue;
      var totalPercentage = netPercentage + revenuePercentage + exchangePercentage;

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
          value: exchangeValue,
          percentage: exchangePercentage
        },
        total: {
          value: totalValue,
          percentage: totalPercentage
        }
      };
    }

    function getStockItemData() {
      $this.promotionTotals.map(function (promotion) {
        reconciliationFactory.getPromotion(promotion.promotionId).then(function (dataFromAPI) {
          promotion.itemName = dataFromAPI.promotionCode;
        });
        promotion.itemTypeName = 'Promotion';
      });

      $filter('filter')($this.stockTotals, {itemTypeName: 'Virtual'}).map(function (item) {
        reconciliationFactory.getItem(item.itemMasterId).then(function (dataFromAPI) {
          item.itemName = dataFromAPI.itemName;
        });
      });

      $filter('filter')($this.stockTotals, {itemTypeName: 'Voucher'}).map(function (item) {
        reconciliationFactory.getItem(item.itemMasterId).then(function (dataFromAPI) {
          item.itemName = dataFromAPI.itemName;
        });
      });
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
        netLMP: formatAsCurrency(netLMP),
        netEPOS: formatAsCurrency(netEPOS)
      };

      var stockItems = angular.copy($this.stockTotals).concat($this.promotionTotals);
      $scope.stockTotals = angular.extend(stockTotals, {totalNet: netTotals}, {stockItems: stockItems});
    }

    function getEPOSRevenue(eposRevenue) {
      $this.eposCashBag = angular.copy(eposRevenue[0].response);
      var eposCreditCard = angular.copy(eposRevenue[1].response);
      var eposDiscount = angular.copy(eposRevenue[2].response);
      var total = 0;

      total += lodash.reduce($this.eposCashBag, function (total, cashBag) {
        if (cashBag.bankAmount) {
          return total + cashBag.bankAmount;
        } else if (cashBag.coinAmountManual && cashBag.paperAmountManual) {
          return total + cashBag.coinAmountManual + cashBag.paperAmountManual;
        }
      });

      total += lodash.reduce(eposCreditCard, function (total, creditCard) {
        if (creditCard.bankAmountFinal) {
          return total + creditCard.bankAmountFinal;
        }
      });

      total += lodash.reduce(eposDiscount, function (total, discount) {
        if (discount.bankAmountFinal) {
          return total + discount.bankAmountFinal;
        }
      });

      return total;
    }

    function getCHRevenue(chRevenue) {
      $this.chCashBag = angular.copy(chRevenue[0].response);
      var chCreditCard = angular.copy(chRevenue[1].response);
      var chDiscount = angular.copy(chRevenue[2].response);
      var total = 0;

      total += lodash.reduce($this.chCashBag, function (total, cashBag) {
        if (cashBag.bankAmountCh) {
          return total + cashBag.bankAmountCh;
        } else if (cashBag.coinAmountManualCh && cashBag.paperAmountManualCh) {
          return total + cashBag.coinAmountManualCh + cashBag.paperAmountManualCh;
        }
      });

      total += lodash.reduce(chCreditCard, function (total, creditCard) {
        if (creditCard.bankAmountFinal) {
          return total + creditCard.bankAmountFinal;
        } else if (creditCard.coinAmountManualCc && creditCard.paperAmountManualCc) {
          return total + creditCard.coinAmountManualCc + creditCard.paperAmountManualCc;
        }
      });

      total += lodash.reduce(chDiscount, function (total, discount) {
        if (discount.bankAmountFinal) {
          return total + discount.bankAmountFinal;
        } else if (discount.coinAmountManualCc && discount.paperAmountManualCc) {
          return total + discount.coinAmountManualCc + discount.paperAmountManualCc;
        }
      });

      return total;
    }

    function setupPaymentReport(reportList) {
      $scope.paymentReport = angular.copy(reportList);
    }

    function setupData(responseCollection) {
      $this.itemTypes = angular.copy(responseCollection[0]);
      $this.countTypes = angular.copy(responseCollection[1]);
      $this.stockTotals = angular.copy(responseCollection[2].response);
      $this.promotionTotals = angular.copy(responseCollection[3].response);
      $this.chRevenue = angular.copy(responseCollection[4]);
      $this.eposRevenue = angular.copy(responseCollection[5]);
      $this.globalCurrencyList = angular.copy(responseCollection[6].response);
      $scope.companyBaseCurrency = getCurrencyByBaseCurrencyId($this.globalCurrencyList, responseCollection[7].baseCurrencyId);
      setupPaymentReport(angular.copy(responseCollection[8]));

      $scope.totalRevenue = {
        cashHandler: formatAsCurrency(getCHRevenue($this.chRevenue)),
        epos: formatAsCurrency(getEPOSRevenue($this.eposRevenue))
      };

      $this.stockTotals.map(function (stockItem) {
        stockItem.itemTypeName = lodash.findWhere($this.itemTypes, {id: stockItem.itemTypeId}).name;
      });

      var totalItems = getTotalsFor($this.stockTotals, 'Regular');
      var totalVirtual = getTotalsFor($this.stockTotals, 'Virtual');
      var totalVoucher = getTotalsFor($this.stockTotals, 'Voucher');
      var totalPromotion = getTotalsForPromotions($this.promotionTotals);

      var stockObject = {
        totalRetail: totalItems,
        totalVirtual: totalVirtual,
        totalVoucher: totalVoucher,
        totalPromotion: totalPromotion
      };

      getCashBagData();
      setNetTotals(stockObject);
      setStockData($this.stockTotals);
      getStockItemData();
      setDiscrepancy();
    }

    function initData() {
      var companyId = GlobalMenuService.company.get();
      var promiseArray = [
        reconciliationFactory.getItemTypesList(),
        reconciliationFactory.getCountTypes(),
        reconciliationFactory.getStockTotals($routeParams.storeInstanceId),
        reconciliationFactory.getPromotionTotals($routeParams.storeInstanceId),
        reconciliationFactory.getCHRevenue($routeParams.storeInstanceId),
        reconciliationFactory.getEPOSRevenue($routeParams.storeInstanceId),
        reconciliationFactory.getCompanyGlobalCurrencies(),
        reconciliationFactory.getCompany(companyId),
        reconciliationFactory.getPaymentReport($routeParams.storeInstanceId)
      ];

      $q.all(promiseArray).then(setupData, handleResponseError);
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
      $scope.actionOnPaymentReport = 'Show';
      //showLoadingModal('Loading Reconciliation Discrepancy Details');
      //reconciliationFactory.getStoreInstanceDetails($routeParams.storeInstanceId).then(getStoreInstanceDetailsSuccessHandler, handleResponseError);
      $scope.cashBags = [{cashBag:345}, {cashBag: 789}];

      angular.element('#checkbox').bootstrapSwitch();
      initTableDefaults();
    }

    $scope.showModal = function (modalName) {
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
      if (!$scope.stockTotals || !$scope.stockTotals['total' + modalName]) {
        return;
      }

      $scope.modalTotal = $scope.stockTotals['total' + modalName].totalEPOS;
      $scope.modalItemTypeName = modalName;
      if (modalNameToHeaderMap[modalName] && modalNamToTableHeaderMap[modalName]) {
        $scope.modalMainTitle = modalNameToHeaderMap[modalName];
        $scope.modalTableHeader = modalNamToTableHeaderMap[modalName];
      }

      angular.element('#t6Modal').modal('show');
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

    $scope.showPaymentReportPanel = function () {
      angular.element('#paymentReportModal').modal('show');
    };

    $scope.showModal = function () {
      angular.element('#reallocateModal').modal('show');
    };

    init();

  });
