'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDiscrepancyDetail
 * @description
 * # ReconciliationDiscrepancyDetailCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDiscrepancyDetail', function ($q, $scope, $routeParams, $filter, $route, messageService,
                                                           reconciliationFactory, currencyFactory, storeInstanceFactory, globalMenuService, dateUtility, lodash) {

    var $this = this;

    function formatAsCurrency(valueToFormat, optionalNumDigits) {
      var precision = (optionalNumDigits) ? '%.' + optionalNumDigits + 'f' : '%.2f';
      return (valueToFormat) ? sprintf(precision, valueToFormat) : sprintf(precision, 0);
    }

    function makeFinite(valueToCheck) {
      return isFinite(valueToCheck) ? valueToCheck : 0;
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
      var eposSales = getIntOrZero(stockItem.eposQuantity);
      var lmpDispatchedCount = getIntOrZero(stockItem.dispatchedCount);
      var lmpReplenishCount = getIntOrZero(stockItem.replenishCount);
      var lmpIncomingCount = getIntOrZero(stockItem.inboundedCount);
      var offloadCount = getIntOrZero(stockItem.offloadCount);

      return eposSales - ((lmpDispatchedCount + lmpReplenishCount) - (lmpIncomingCount + offloadCount));
    }

    function getVarianceValue(varianceQuantity, retailPrice) {
      return makeFinite(varianceQuantity * retailPrice);
    }

    function getIntOrZero(value) {
      var result = value || 0;

      return parseInt(result);
    }

    function setStockItem(stockItem) {
      var varianceQuantity = getVarianceQuantity(stockItem);
      var retailValue = parseFloat(stockItem.price);
      var varianceValue = getVarianceValue(varianceQuantity, retailValue);
      var isDiscrepancy = (parseInt(varianceQuantity) !== 0);
      var dispatchedCount = getIntOrZero(stockItem.dispatchedCount);
      var replenishCount = getIntOrZero(stockItem.replenishCount);
      var eposQuantity = getIntOrZero(stockItem.eposQuantity);
      var eposUpliftCount = getIntOrZero(stockItem.eposUpliftCount);
      var inboundOffloadCount = stockItem.inboundedCount || stockItem.offloadCount || 0;

      return {
        itemMasterId: stockItem.itemMasterId,
        storeInstanceId: stockItem.storeInstanceId,
        replenishStoreInstanceId: stockItem.replenishStoreInstanceId,
        itemId: stockItem.itemId,
        itemName: stockItem.itemName,
        cateringStationId: stockItem.cateringStationId,
        cciStagId: stockItem.cciStagId,
        ullageReasonCode: stockItem.ullageReasonCode,
        dispatchedCount: dispatchedCount,
        replenishCount: replenishCount,
        inboundOffloadCount: inboundOffloadCount,
        inboundedCount: stockItem.inboundedCount,
        offloadCount: stockItem.offloadCount,
        eposQuantity: eposQuantity,
        varianceQuantity: varianceQuantity,
        retailValue: formatAsCurrency(retailValue),
        varianceValue: formatAsCurrency(varianceValue),
        isDiscrepancy: isDiscrepancy,
        eposUpliftCount: eposUpliftCount
      };
    }

    function mergeItems(itemListFromAPI, rawLMPStockData, stockCountsFromAPI) {
      var rawItemList = angular.copy(itemListFromAPI);
      var rawStockCounts = angular.copy(stockCountsFromAPI);
      var uniqueItemList = lodash.uniq(angular.copy(rawItemList), 'itemMasterId');

      angular.forEach(uniqueItemList, function (item) {
        var stockCount = $filter('filter')(rawStockCounts, {
          itemMasterId: item.itemMasterId
        }, true);

        if (stockCount.length) {
          angular.merge(item, stockCount[0]);
        }

        var lmpStockItem = $filter('filter')(rawLMPStockData, {
          itemMasterId: item.itemMasterId
        }, true);
        if (lmpStockItem.length) {
          item.eposQuantity = lmpStockItem[0].eposQuantity;
          item.eposTotal = lmpStockItem[0].eposTotal;
          item.lmpQuantity = lmpStockItem[0].lmpQuantity;
          item.lmpTotal = lmpStockItem[0].lmpTotal;
          item.price = lmpStockItem[0].price;
        }
      });

      return uniqueItemList;
    }

    function getOutlierItemsDetails(carrierInstanceData) {
      $scope.outlierItemData = $scope.outlierItemData || {};

      if (!$scope.outlierItemData.storeNumber) {
        $scope.outlierItemData.storeNumber = carrierInstanceData.storeNumber;
      }

      if (!$scope.outlierItemData.scheduleDate) {
        $scope.outlierItemData.scheduleDate = dateUtility.formatDateForApp(carrierInstanceData.instanceDate);
      }

      var menuArray = carrierInstanceData.menuIds.split(',');
      angular.forEach(menuArray, function (menuId) {
        var menuMatch = lodash.findWhere($this.menuList, { menuId: parseInt(menuId) });
        $scope.outlierItemData.menuList = $scope.outlierItemData.menuList || [];
        if (menuMatch && $scope.outlierItemData.menuList.indexOf(menuMatch.menuName) < 0) {
          $scope.outlierItemData.menuList.push(menuMatch.menuName);
        }
      });
    }

    function formatEposItem(item, rawLMPStockData) {
      var carrierInstanceMatch = lodash.findWhere($this.carrierInstanceList, { id: item.companyCarrierInstanceId });
      if (!carrierInstanceMatch) {
        return;
      }

      getOutlierItemsDetails(carrierInstanceMatch);
      var stockItemMatch = lodash.findWhere(rawLMPStockData, { itemMasterId: item.itemMasterId });
      item.eposQuantity = (!!stockItemMatch) ? stockItemMatch.eposQuantity : 0;
      return item;
    }

    function setOutlierItemsList(eposItemsFromAPI, rawLMPStockData) {
      var filteredEposItems = lodash.filter(eposItemsFromAPI, function (eposItem) {
        var stockItemMatch = lodash.findWhere($scope.stockItemList, { itemMasterId: eposItem.itemMasterId });
        return !stockItemMatch;
      });

      angular.forEach(filteredEposItems, function (item) {
        formatEposItem(item, rawLMPStockData);
      });

      $scope.outlierItemList = filteredEposItems;
      $scope.outlierItemData.menuList = $scope.outlierItemData.menuList.toString();
    }

    function filterOutEposItemsFromStockItems(storeInstanceItems) {
      var stockItemList = [];
      var eposItemList = [];
      var faCloseId = lodash.findWhere($this.countTypes, { name: 'FAClose' }).id;
      var faOpenId = lodash.findWhere($this.countTypes, { name: 'FAOpen' }).id;

      angular.forEach(storeInstanceItems, function (item) {
        if (item.countTypeId === faCloseId) {
          eposItemList.push(item);
        } else if (item.countTypeId !== faOpenId) {
          stockItemList.push(item);
        }
      });

      return {
        stockItems: stockItemList,
        eposItems: eposItemList
      };
    }

    function setStockAndStockOutlierItemLists(storeInstanceListFromAPI, rawLMPStockData) {
      var filteredStockAndEposItems = filterOutEposItemsFromStockItems(angular.copy(storeInstanceListFromAPI.response));

      reconciliationFactory.getStockItemCounts($routeParams.storeInstanceId).then(function (stockCountsFromAPI) {
        var filteredItems = mergeItems(filteredStockAndEposItems.stockItems, rawLMPStockData, stockCountsFromAPI.response);
        $scope.stockItemList = lodash.map(filteredItems, setStockItem);
        setOutlierItemsList(filteredStockAndEposItems.eposItems, rawLMPStockData);
        initLMPStockRevisions();
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

    function setStockData(stockData) {
      var rawLMPStockData = angular.copy(stockData);

      reconciliationFactory.getStoreInstanceItemList($routeParams.storeInstanceId, { showEpos: true }).then(function (storeInstanceItemList) {
        setStockAndStockOutlierItemLists(storeInstanceItemList, rawLMPStockData);
      }, handleResponseError);
    }

    function getCurrencyByBaseCurrencyId(currenciesArray, baseCurrencyId) {
      var currencyMatchObject = currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];

      return currencyMatchObject || { currencyCode: '' };
    }

    function formatCashBags(cashHandlerCashBagList) {
      var formattedCashBagList = [];
      $scope.isPaperAndCoinExchangeRatePreferred = false;
      angular.forEach(cashHandlerCashBagList, function (cashBag) {
        cashBag.currencyObject = getCurrencyByBaseCurrencyId($this.globalCurrencyList, cashBag.retailCompanyCurrency);
        var eposCalculatedAmount = cashBag.eposCalculatedAmount;
        var crewAmount = cashBag.paperAmountEpos + cashBag.coinAmountEpos;
        $scope.isPaperAndCoinExchangeRatePreferred = (!!cashBag.chBankExchangeRate) ? ($scope.isPaperAndCoinExchangeRatePreferred) : true;
        var bankOrPaperExchangeRate = cashBag.chBankExchangeRate || cashBag.chPaperExchangeRate;
        var coinExchangeRate = cashBag.chCoinExchangeRate;
        var paperAmount = cashBag.paperAmountManual;
        var coinAmount = cashBag.coinAmountManual;
        var convertedPaperAmount = cashBag.paperAmountManualCh || cashBag.paperAmountManualCHBank;
        var convertdCoinAmount = cashBag.coinAmountManualCh || cashBag.coinAmountManualCHBank;
        var totalBank = convertedPaperAmount + convertdCoinAmount;
        var varianceValue = (paperAmount + coinAmount) - eposCalculatedAmount;
        var isDiscrepancy = (formatAsCurrency(varianceValue) !== '0.00');

        var cashBagItem = {
          id: cashBag.id,
          cashBagNumber: cashBag.cashbagNumber,
          currency: cashBag.currencyObject.currencyCode,
          eposCalculatedAmount: formatAsCurrency(eposCalculatedAmount),
          crewAmount: formatAsCurrency(crewAmount),
          paperAmount: formatAsCurrency(paperAmount),
          coinAmount: formatAsCurrency(coinAmount),
          varianceValue: formatAsCurrency(varianceValue),
          bankOrPaperExchangeRate: formatAsCurrency(bankOrPaperExchangeRate, 4),
          coinExchangeRate: formatAsCurrency(coinExchangeRate, 4),
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

    function getTotalsFor(stockTotals, itemTypeName) {
      var stockItem = $filter('filter')(stockTotals, {
        itemTypeName: itemTypeName
      });
      var totalLMP = 0;
      var totalEPOS = 0;
      angular.forEach(stockItem, function (item) {
        totalLMP += item.lmpTotal || 0;
        totalEPOS += item.eposTotal || 0;
      });

      return {
        parsedLMP: totalLMP,
        parsedEPOS: totalEPOS,
        totalLMP: formatAsCurrency(totalLMP),
        totalEPOS: formatAsCurrency(totalEPOS)
      };
    }

    function getTotalsForPromotions(promotionTotals) {
      var total = 0;
      angular.forEach(promotionTotals, function (promotionItem) {
        total += promotionItem.discountApplied;
      });

      return {
        parsedLMP: total,
        parsedEPOS: total,
        totalLMP: formatAsCurrency(total),
        totalEPOS: formatAsCurrency(total)
      };
    }

    this.checkIfCompanyUseCash = function () {
      var cashPreference = lodash.where($this.companyPreferences, {
        choiceName: 'Active',
        optionCode: 'CSL',
        optionName: 'Cashless'
      })[0];
      if (cashPreference && cashPreference.hasOwnProperty('startDate')) {
        var yesterdayOrEarlier = dateUtility.isTodayOrEarlier(dateUtility.formatDateForApp(cashPreference.startDate,
          'YYYY-MM-DD'));
        return !(cashPreference.isSelected === true && yesterdayOrEarlier);
      }

      return true;
    };

    function setCashPreference(companyPreferencesData) {
      $this.companyPreferences = lodash.sortByOrder(angular.copy(companyPreferencesData.preferences), 'startDate',
        'desc');
      $scope.companyIsUsingCash = $this.checkIfCompanyUseCash();
    }

    function setDiscrepancy() {
      var netValue = parseFloat($scope.stockTotals.totalNet.netEPOS) - parseFloat($scope.stockTotals.totalNet.netLMP);
      var netPercentage = (makeFinite(netValue / parseFloat($scope.stockTotals.totalNet.netEPOS))) * 100;

      var revenueValue = 0;
      var revenuePercentage = 0;
      var exchangeValue = 0;
      var exchangePercentage = 0;

      if ($scope.companyIsUsingCash) {
        revenueValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.stockTotals.totalNet.netEPOS);
        revenuePercentage = (makeFinite(revenueValue / parseFloat($scope.stockTotals.totalNet.netEPOS))) * 100;
        exchangeValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.totalRevenue.epos);
        exchangePercentage = (makeFinite(exchangeValue / parseFloat($scope.stockTotals.totalNet.netEPOS))) * 100;
      }

      var totalValue = netValue + revenueValue + exchangeValue;
      var totalPercentage = netPercentage + revenuePercentage + exchangePercentage;

      $scope.discrepancy = {
        net: {
          value: formatAsCurrency(netValue),
          percentage: formatAsCurrency(netPercentage)
        },
        revenue: {
          value: formatAsCurrency(revenueValue),
          percentage: formatAsCurrency(revenuePercentage)
        },
        exchange: {
          value: formatAsCurrency(exchangeValue),
          percentage: formatAsCurrency(exchangePercentage)
        },
        total: {
          value: formatAsCurrency(totalValue),
          percentage: formatAsCurrency(totalPercentage)
        }
      };
    }

    function getStockItemData() {

      $filter('filter')($this.promotionTotals, {
        exchangeRateTypeId: 1
      }).map(function (promotion) {
        promotion.eposQuantity = promotion.quantity;
        promotion.eposTotal = formatAsCurrency(promotion.discountApplied);
        reconciliationFactory.getPromotion(promotion.promotionId).then(function (dataFromAPI) {
          promotion.itemName = dataFromAPI.promotionName;
        }, handleResponseError);

        promotion.itemTypeName = 'Promotion';
      });

      $filter('filter')($this.stockTotals, {
        itemTypeName: 'Virtual'
      }).map(function (item) {
        reconciliationFactory.getMasterItem(item.itemMasterId).then(function (dataFromAPI) {
          item.itemName = dataFromAPI.itemName;
        }, handleResponseError);
      });

      $filter('filter')($this.stockTotals, {
        itemTypeName: 'Voucher'
      }).map(function (item) {
        reconciliationFactory.getMasterItem(item.itemMasterId).then(function (dataFromAPI) {
          item.itemName = dataFromAPI.itemName;
        }, handleResponseError);
      });
    }

    function setNetTotals(stockData) {
      var stockTotals = angular.copy(stockData);
      var netLMP = stockTotals.totalRetail.parsedLMP + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher
          .parsedEPOS - stockTotals.totalPromotion.parsedLMP;
      var netEPOS = stockTotals.totalRetail.parsedEPOS + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher
          .parsedEPOS - stockTotals.totalPromotion.parsedEPOS;

      var netTotals = {
        netLMP: formatAsCurrency(netLMP),
        netEPOS: formatAsCurrency(netEPOS)
      };

      var stockItems = $this.stockTotals.concat($this.promotionTotals);
      $scope.stockTotals = angular.extend(stockTotals, {
        totalNet: netTotals
      }, {
        stockItems: stockItems
      });
    }

    function getEPOSRevenue(eposRevenue) {
      $this.eposCashBag = angular.copy(eposRevenue[0].response);
      var eposCreditCard = angular.copy(eposRevenue[1].response);
      var eposDiscount = angular.copy(eposRevenue[2].response);
      var total = 0;

      angular.forEach($this.eposCashBag, function (cashBag) {
        total += cashBag.bankAmount + cashBag.coinAmountManual + cashBag.paperAmountManual;
      });

      angular.forEach(eposCreditCard, function (creditCard) {
        total += creditCard.bankAmountFinal;
      });

      angular.forEach(eposDiscount, function (discount) {
        total += discount.bankAmountFinal;
      });

      return total;
    }

    function getCHRevenue(chRevenue) {
      $this.chCashBag = angular.copy(chRevenue[0].response);
      var chCreditCard = angular.copy(chRevenue[1].response);
      var chDiscount = angular.copy(chRevenue[2].response);
      var total = 0;

      angular.forEach($this.chCashBag, function (cashBag) {
        total += (cashBag.paperAmountManualCh + cashBag.coinAmountManualCh) + (cashBag.paperAmountManualCHBank +
          cashBag.coinAmountManualCHBank) + (cashBag.bankAmountCh);
      });

      angular.forEach(chCreditCard, function (creditCard) {
        total += creditCard.bankAmountFinal + creditCard.coinAmountManualCc + creditCard.paperAmountManualCc;
      });

      angular.forEach(chDiscount, function (discount) {
        total += discount.bankAmountFinal + discount.coinAmountCc + discount.paperAmountCc;
      });

      return total;
    }

    function setupPaymentReport(reportList) {
      var paymentReportList = angular.copy(reportList.paymentReports);
      angular.forEach(paymentReportList, function (report) {
        report.scheduleDate = dateUtility.formatDateForApp(report.scheduleDate, 'YYYY-MM-DDThh:mm');
      });

      $scope.paymentReport = paymentReportList;
    }

    function setStatusList(response) {
      $scope.statusList = angular.copy(response);
      $scope.storeInstance.statusName = findStatusName($scope.storeInstance.statusId);
    }

    function consolidateDuplicatePromotions() {
      var consolidatedPromotions = [];
      angular.forEach($this.promotionTotals, function (promotion) {
        var promotionMatch = lodash.findWhere(consolidatedPromotions, { promotionId: promotion.promotionId });
        if (promotionMatch) {
          promotionMatch.discountApplied = promotionMatch.discountApplied + promotion.discountApplied;
          promotionMatch.quantity += (promotion.quantity || 1);
        } else {
          promotion.quantity = 1;
          consolidatedPromotions.push(promotion);
        }
      });

      $this.promotionTotals = consolidatedPromotions;
    }

    function setupData(responseCollection) {
      $this.itemTypes = angular.copy(responseCollection[0]);
      $this.countTypes = angular.copy(responseCollection[1]);
      $this.stockTotals = angular.copy(responseCollection[2].response);
      $this.promotionTotals = $filter('filter')(angular.copy(responseCollection[3].response), {
        exchangeRateTypeId: 1
      });
      consolidateDuplicatePromotions();

      $this.chRevenue = angular.copy(responseCollection[4]);
      $this.eposRevenue = angular.copy(responseCollection[5]);
      $this.globalCurrencyList = angular.copy(responseCollection[6].response);
      $scope.companyBaseCurrency = getCurrencyByBaseCurrencyId($this.globalCurrencyList, responseCollection[7].baseCurrencyId);
      setupPaymentReport(angular.copy(responseCollection[8]));
      setCashPreference(responseCollection[9]);
      setStatusList(responseCollection[10]);
      $this.carrierInstanceList = angular.copy(responseCollection[11].response);
      $this.menuList = angular.copy(responseCollection[12].menus);

      $scope.totalRevenue = {
        cashHandler: $scope.companyIsUsingCash ? formatAsCurrency(getCHRevenue($this.chRevenue)) : 0,
        epos: formatAsCurrency(getEPOSRevenue($this.eposRevenue))
      };

      $this.stockTotals.map(function (stockItem) {
        stockItem.itemTypeName = lodash.findWhere($this.itemTypes, {
          id: stockItem.itemTypeId
        }).name;
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

      hideLoadingModal();
    }

    function initData() {
      var companyId = globalMenuService.company.get();
      var promiseArray = [
        reconciliationFactory.getItemTypesList(),
        reconciliationFactory.getCountTypes(),
        reconciliationFactory.getStockTotals($routeParams.storeInstanceId),
        reconciliationFactory.getPromotionTotals($routeParams.storeInstanceId),
        reconciliationFactory.getCHRevenue($routeParams.storeInstanceId),
        reconciliationFactory.getEPOSRevenue($routeParams.storeInstanceId),
        reconciliationFactory.getCompanyGlobalCurrencies(),
        reconciliationFactory.getCompany(companyId),
        reconciliationFactory.getPaymentReport($routeParams.storeInstanceId),
        reconciliationFactory.getCompanyPreferences(),
        reconciliationFactory.getStoreStatusList(),
        reconciliationFactory.getCarrierInstanceList($routeParams.storeInstanceId),
        reconciliationFactory.getMenuList()
      ];

      $q.all(promiseArray).then(setupData, handleResponseError);
    }

    function formatDates(storeInstanceData) {
      storeInstanceData.scheduleDate = dateUtility.formatDateForApp(storeInstanceData.scheduleDate);
      return storeInstanceData;
    }

    function findStatusName(id) {
      var name;
      if (angular.isDefined($scope.statusList) && angular.isDefined(id)) {
        angular.forEach($scope.statusList, function (status) {
          if (status.id === parseInt(id)) {
            name = status.statusName;
          }

        });
      }

      return name;
    }

    function getStoreInstanceDetailsSuccessHandler(storeInstanceDataFromAPI) {
      $scope.storeInstance = formatDates(angular.copy(storeInstanceDataFromAPI));
      initData();
    }

    function confirmModal(state) {
      angular.element('#action-confirm').modal(state);
    }

    function showMessage(type, message) {
      messageService.display(type, message);
    }

    function actionSuccess(response) {
      var id = angular.copy(response[0].id);
      var storeNumber = angular.copy($scope.storeInstance.storeDetails.storeNumber);
      var message = '<b>Store Number:</b> ' + storeNumber + ' - <b>Store Instance:</b> ' + id + ' has been updated.';
      hideLoadingModal();
      $route.reload();
      return showMessage('success', message);
    }

    function changeStatus(payload) {
      return [
        storeInstanceFactory.updateStoreInstanceStatus(payload.id, payload.status)
      ];
    }

    function performActionPromises(payload) {
      var promises = changeStatus(payload);
      showLoadingModal();
      $q.all(promises).then(actionSuccess, handleResponseError);
    }

    function getActionStatusId() {
      var id;
      var action = $scope.actionToExecute;
      angular.forEach($scope.statusList, function (status) {
        if (status.statusName === action) {
          id = status.name;
        }
      });

      return id;
    }

    function performAction() {
      var payload = {
        id: $scope.storeInstance.id,
        status: getActionStatusId()
      };
      return performActionPromises(payload);
    }

    function initTableDefaults() {
      $scope.showLMPDiscrepancies = true;
      $scope.showCashBagDiscrepancies = true;
      $scope.editLMPStockTable = false;
      $scope.editCashBagTable = false;
      $scope.LMPSortTitle = 'itemName';
      $scope.cashBagSortTitle = 'currency';
      $scope.cashBagFilter = {};
    }

    function init() {
      $scope.actionOnPaymentReport = 'Show';
      showLoadingModal('Loading Reconciliation Discrepancy Details');
      reconciliationFactory.getStoreInstanceDetails($routeParams.storeInstanceId).then(
        getStoreInstanceDetailsSuccessHandler, handleResponseError);
      angular.element('#checkbox').bootstrapSwitch();
      initTableDefaults();
    }

    $scope.canEdit = function () {
      return !!$scope.storeInstance && $scope.storeInstance.statusName !== 'Commission Paid';
    };

    $scope.showOutlierItems = function () {
      angular.element('#outlier-items').modal('show');
    };

    $scope.showModal = function (modalName) {
      var modalNameToHeaderMap = {
        Virtual: 'Virtual Product Revenue',
        Voucher: 'Voucher Product Revenue',
        Promotion: 'ePOS Discount'
      };
      var modalNamToTableHeaderMap = {
        Virtual: 'Virtual Product Name',
        Voucher: 'Voucher Product Name',
        Promotion: 'Promotion Name'
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

    $scope.hasReplenishInstance = function (items) {
      var replenishInstances = items.filter(function (item) {
        return item.replenishStoreInstanceId !== null;
      });

      return replenishInstances.length > 0;
    };

    function saveCurrenciesSuccess() {
      initData();
      $scope.editCashBagTable = false;
    }

    function saveCashBagCurrencies(currencyArray) {
      showLoadingModal('Saving Cash Bag Currencies...');
      var promiseArray = [];
      angular.forEach(currencyArray, function (currency) {
        var payload = {
          paperAmountManual: (isNaN(parseFloat(currency.revision.paperAmount))) ? parseFloat(currency.paperAmount).toFixed(2) : parseFloat(currency.revision.paperAmount).toFixed(2),
          coinAmountManual: (isNaN(parseFloat(currency.revision.coinAmount))) ? parseFloat(currency.coinAmount).toFixed(2) : parseFloat(currency.revision.coinAmount).toFixed(2)
        };
        promiseArray.push(reconciliationFactory.saveCashBagCurrency(currency.id, payload));
      });

      $q.all(promiseArray).then(saveCurrenciesSuccess, handleResponseError);
    }

    $scope.saveCashBagCurrency = function (currency) {
      saveCashBagCurrencies([currency]);
    };

    $scope.saveCashBagTable = function () {
      saveCashBagCurrencies($scope.cashBags);
    };

    $scope.saveStockItemCounts = function (item) {
      saveStockItemsCounts([item]);
    };

    $scope.saveStockItemCountsTable = function () {
      saveStockItemsCounts($scope.stockItemList);
    };

    function isDefinedAndNotNull(val) {
      return angular.isDefined(val) && val !== null;
    }

    function isInboundedDefined(item) {
      return isDefinedAndNotNull(item.inboundedCount);
    }

    function saveStockItemsCounts(items) {
      var payload = items.map(function (item) {
        var counts = (item.revision) ? item.revision : item;
        var inboundedCount = 0;
        var offloadCount = 0;

        if (isInboundedDefined(item)) {
          inboundedCount = getIntOrZero(counts.inboundOffloadCount);
        } else {
          offloadCount = getIntOrZero(counts.inboundOffloadCount);
        }

        return {
          storeInstanceId: item.storeInstanceId,
          replenishStoreInstanceId: item.replenishStoreInstanceId,
          itemMasterId: item.itemMasterId,
          dispatchedCount: getIntOrZero(counts.dispatchedCount),
          replenishCount: getIntOrZero(counts.replenishCount),
          inboundedCount: inboundedCount,
          offloadCount: offloadCount,
          companyId: item.companyId,
          itemId: item.itemId,
          cateringStationId: item.cateringStationId,
          cciStagId: item.cciStagId,
          ullageReasonCode: item.ullageReasonCode
        };
      });

      reconciliationFactory.saveStockItemsCounts(payload).then(handleStockItemsCountsSaveSuccess(items),
        handleResponseError);
    }

    function handleStockItemsCountsSaveSuccess(items) {
      angular.forEach(items, function (item) {
        if (isInboundedDefined(item)) {
          item.inboundedCount = getIntOrZero(item.revision.inboundOffloadCount);
        } else {
          item.offloadCount = getIntOrZero(item.revision.inboundOffloadCount);
        }

        item.dispatchedCount = getIntOrZero(item.revision.dispatchedCount);
        item.replenishCount = getIntOrZero(item.revision.replenishCount);
        item.inboundOffloadCount = getIntOrZero(item.revision.inboundOffloadCount);
        item.varianceQuantity = getVarianceQuantity(item);
        item.varianceValue = formatAsCurrency(getVarianceValue(item.varianceQuantity, item.retailValue));
        item.isEditing = false;
        item.revision = {};
        $scope.editLMPStockTable = false;
      });
    }

    $scope.initEditTable = function (isLMPTable) {
      if (isLMPTable) {
        $scope.editLMPStockTable = true;
        initLMPStockRevisions();
      } else {
        $scope.editCashBagTable = true;
        initCashBagRevisions();
      }
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

    $scope.isInStatus = function (status) {
      if (angular.isDefined(status) && angular.isDefined($scope.statusList)) {
        if ($scope.storeInstance.statusName === status) {
          return true;
        }

        return false;
      }
    };

    $scope.confirmAction = function (action, actionName) {
      if (angular.isDefined(action)) {
        $scope.actionToExecute = action;
        if (angular.isDefined(actionName)) {
          $scope.actionName = actionName;
        }

        return confirmModal('show');
      }
    };

    $scope.performAction = function () {
      if (angular.isDefined($scope.actionToExecute)) {
        confirmModal('hide');
        return performAction();
      }
    };

    init();

  });
