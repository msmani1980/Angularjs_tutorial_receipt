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
                                                           reconciliationFactory, currencyFactory, storeInstanceFactory, globalMenuService, dateUtility, lodash,
                                                           $location) {

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
      if ($scope.outlierItemList.length) {
        $scope.outlierItemData.menuList = $scope.outlierItemData.menuList.toString();
      }
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

    function getManualDataTotals(manualDataType) {
      var arrayToSum = (manualDataType === 'regular') ? $this.manualData.cash.concat($this.manualData.credit) : $this.manualData[manualDataType];
      var total = 0;
      angular.forEach(arrayToSum, function (manualDataEntry) {
        total += (manualDataType === 'promotion') ? manualDataEntry.totalConvertedAmount : manualDataEntry.convertedAmount;
      });

      return total;
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

      totalEPOS += getManualDataTotals(itemTypeName.toLowerCase());

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
        total += promotionItem.convertedAmount;
      });

      var eposTotal = total + getManualDataTotals('promotion');

      return {
        parsedLMP: total,
        parsedEPOS: eposTotal,
        totalLMP: formatAsCurrency(total),
        totalEPOS: formatAsCurrency(eposTotal)
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
        revenueValue = parseFloat($scope.totalRevenue.epos) - parseFloat($scope.stockTotals.totalNet.netEPOS);
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
        promotion.eposTotal = formatAsCurrency(promotion.convertedAmount);
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

    function getManualItemDataSet(itemTypeName) {
      var manualItemArray = [];
      var dataType = itemTypeName.toLowerCase();
      angular.forEach($this.manualData[dataType], function (manualItem) {
        var amountToSave = (dataType === 'promotion') ? manualItem.totalConvertedAmount : manualItem.convertedAmount;
        if (amountToSave > 0) {
          var newItem = {
            eposQuantity: manualItem.quantity,
            eposTotal: amountToSave.toFixed(2),
            itemName: (dataType === 'promotion') ? manualItem.promotion.promotionName : manualItem.itemMaster.itemName,
            itemTypeName: itemTypeName
          };

          manualItemArray.push(newItem);
        }
      });

      return manualItemArray;
    }

    function getManualItemData() {
      var itemTypes = ['Virtual', 'Voucher', 'Promotion'];
      var allManualItemsArray = [];
      angular.forEach(itemTypes, function (itemType) {
        allManualItemsArray = allManualItemsArray.concat(getManualItemDataSet(itemType));
      });

      return allManualItemsArray;
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
      stockItems = stockItems.concat(getManualItemData());

      $scope.stockTotals = angular.extend(stockTotals, {
        totalNet: netTotals
      }, {
        stockItems: stockItems
      });
    }

    function getEPOSRevenue(eposRevenue) {
      $this.eposCashBag = angular.copy(eposRevenue[0].response);
      var eposDiscount = angular.copy(eposRevenue[2].response);
      var total = 0;

      angular.forEach($this.eposCashBag, function (cashBag) {
        var cashTotal = makeFinite(cashBag.bankAmount) + makeFinite(cashBag.coinAmountManual) + makeFinite(cashBag.paperAmountManual);
        total += ($scope.submittedCashBags.indexOf(cashBag.cashbagId) >= 0) ? cashTotal : 0;

      });

      // commenting out credit card totals for now because they are already included in eposCashBag.  This could change later if epos format changes :(
      //var eposCreditCard = angular.copy(eposRevenue[1].response);
      //angular.forEach(eposCreditCard, function (creditCard) {
      //  var creditTotal = makeFinite(creditCard.bankAmountFinal);
      //  total += ($scope.submittedCashBags.indexOf(creditCard.cashbagId) >= 0) ? creditTotal : 0;
      //});

      angular.forEach(eposDiscount, function (discount) {
        var discountTotal = makeFinite(discount.bankAmountFinal);
        total += ($scope.submittedCashBags.indexOf(discount.cashbagId) >= 0) ? discountTotal : 0;
      });

      return total;
    }

    function getCHRevenueManualTotals() {
      var total = 0;
      angular.forEach($this.manualData.cash, function (cash) {
        total += ($scope.submittedCashBags.indexOf(cash.cashbagId) >= 0) ? cash.convertedAmount : 0;
      });

      angular.forEach($this.manualData.credit, function (credit) {
        total += ($scope.submittedCashBags.indexOf(credit.cashbagId) >= 0) ? credit.convertedAmount : 0;
      });

      angular.forEach($this.manualData.discount, function (discount) {
        total += ($scope.submittedCashBags.indexOf(discount.cashbagId) >= 0) ? discount.convertedAmount : 0;
      });

      return total;
    }

    function getCHRevenue(chRevenue) {
      $this.chCashBag = angular.copy(chRevenue[0].response);
      var chDiscount = angular.copy(chRevenue[2].response);
      var total = 0;

      angular.forEach($this.chCashBag, function (cashBag) {
        var cashTotal = (makeFinite(cashBag.paperAmountManualCh) + makeFinite(cashBag.coinAmountManualCh)) + (makeFinite(cashBag.paperAmountManualCHBank) +
          makeFinite(cashBag.coinAmountManualCHBank)) + makeFinite(cashBag.bankAmountCh);
        total += ($scope.submittedCashBags.indexOf(cashBag.cashbagId) >= 0) ? cashTotal : 0;
      });

      // commenting out credit card totals for now because they are already included in chCashBag.  This could change later if epos format changes :(
      //var chCreditCard = angular.copy(chRevenue[1].response);
      //angular.forEach(chCreditCard, function (creditCard) {
      //  var creditTotal = makeFinite(creditCard.bankAmountFinal) + makeFinite(creditCard.coinAmountCc) + makeFinite(creditCard.paperAmountCc);
      //  total += ($scope.submittedCashBags.indexOf(creditCard.cashbagId) >= 0) ? creditTotal : 0;
      //});

      angular.forEach(chDiscount, function (discount) {
        var discountTotal = makeFinite(discount.bankAmountFinal) + makeFinite(discount.coinAmountCc) + makeFinite(discount.paperAmountCc);
        total += ($scope.submittedCashBags.indexOf(discount.cashbagId) >= 0) ? discountTotal : 0;
      });

      total += getCHRevenueManualTotals();
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
          promotionMatch.convertedAmount = promotionMatch.convertedAmount + promotion.convertedAmount;
          promotionMatch.quantity += (promotion.quantity || 1);
        } else {
          promotion.quantity = 1;
          consolidatedPromotions.push(promotion);
        }
      });

      $this.promotionTotals = consolidatedPromotions;
    }

    function setupData(responseCollection) {
      $this.countTypes = angular.copy(responseCollection[0]);
      $this.stockTotals = angular.copy(responseCollection[1].response);
      $this.promotionTotals = $filter('filter')(angular.copy(responseCollection[2].response), {
        exchangeRateTypeId: 1
      });
      consolidateDuplicatePromotions();

      $this.chRevenue = angular.copy(responseCollection[3]);
      $this.eposRevenue = angular.copy(responseCollection[4]);
      $this.globalCurrencyList = angular.copy(responseCollection[5].response);
      $scope.companyBaseCurrency = getCurrencyByBaseCurrencyId($this.globalCurrencyList, responseCollection[6].baseCurrencyId);
      setupPaymentReport(angular.copy(responseCollection[7]));
      setCashPreference(responseCollection[8]);
      setStatusList(responseCollection[9]);
      $this.carrierInstanceList = angular.copy(responseCollection[10].response);
      $this.menuList = angular.copy(responseCollection[11].menus);

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
        storeInstanceFactory.updateStoreInstanceStatus(payload.id, payload.status, (payload.status === '10' ? true : false))
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

    function setManualDataSet(dataFromAPI, cashBagsToInclude, optionalItemFilter) {
      var itemTypeId = (angular.isDefined(optionalItemFilter)) ? lodash.findWhere($this.itemTypes, { name: optionalItemFilter }).id : 0;
      var manualDataSet = [];
      angular.forEach(dataFromAPI, function (manualData) {
        var itemTypeConditional = (angular.isDefined(optionalItemFilter)) ? manualData.itemTypeId === itemTypeId : true;
        if (cashBagsToInclude.indexOf(manualData.cashbagId) >= 0 && itemTypeConditional) {
          manualDataSet.push(manualData);
        }
      });

      return manualDataSet;
    }

    function setManualData(responseCollectionFromAPI) {
      var manualDataToInclude = [];
      angular.forEach($scope.cashBagList, function (cashBag) {
        if (cashBag.eposCashbagId === null && !!cashBag.verificationConfirmedOn) {
          manualDataToInclude.push(cashBag.id);
        }
      });

      $this.manualData = {
        cash: setManualDataSet(angular.copy(responseCollectionFromAPI[3].response), manualDataToInclude),
        credit: setManualDataSet(angular.copy(responseCollectionFromAPI[4].response), manualDataToInclude),
        virtual: setManualDataSet(angular.copy(responseCollectionFromAPI[5].response), manualDataToInclude, 'Virtual'),
        voucher: setManualDataSet(angular.copy(responseCollectionFromAPI[5].response), manualDataToInclude, 'Voucher'),
        promotion: setManualDataSet(angular.copy(responseCollectionFromAPI[7].response), manualDataToInclude),
        discount: setManualDataSet(angular.copy(responseCollectionFromAPI[6].response), manualDataToInclude)
      };
    }

    function setSubmittedCashBagList() {
      var submittedList = [];
      angular.forEach($scope.cashBagList, function (cashBag) {
        if (cashBag.submitted) {
          submittedList.push(cashBag.id);
        }
      });

      return submittedList;
    }

    function initDependenciesSuccess(responseCollectionFromAPI) {
      $scope.storeInstance = formatDates(angular.copy(responseCollectionFromAPI[0]));
      $scope.cashBagList = angular.copy(responseCollectionFromAPI[1].response);
      $scope.submittedCashBags = setSubmittedCashBagList();
      $this.itemTypes = angular.copy(responseCollectionFromAPI[2]);
      setManualData(responseCollectionFromAPI);
      initData();
    }

    function initDependencies() {
      var payloadForManualData = {
        storeInstanceId: $routeParams.storeInstanceId
      };

      var promises = [
        reconciliationFactory.getStoreInstanceDetails($routeParams.storeInstanceId),
        reconciliationFactory.getCashBagVerifications($routeParams.storeInstanceId),
        reconciliationFactory.getItemTypesList(),
        reconciliationFactory.getCashBagManualData('cash', payloadForManualData),
        reconciliationFactory.getCashBagManualData('credit-cards', payloadForManualData),
        reconciliationFactory.getCashBagManualData('items', payloadForManualData),
        reconciliationFactory.getCashBagManualData('discounts', payloadForManualData),
        reconciliationFactory.getCashBagManualData('promotions', payloadForManualData)
      ];

      $q.all(promises).then(initDependenciesSuccess, handleResponseError);
    }

    function init() {
      $scope.actionOnPaymentReport = 'Show';
      showLoadingModal('Loading Reconciliation Discrepancy Details');
      initDependencies();
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

      reconciliationFactory.saveStockItemsCounts(payload).then(handleStockItemsCountsSaveSuccess,
        handleResponseError);
    }

    function handleStockItemsCountsSaveSuccess() {
      init();
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

    $scope.goToStoreInstanceAmend = function () {
      $location.path('/store-instance-amend/' + $scope.storeInstance.id);
    };

    $scope.performAction = function () {
      if (angular.isDefined($scope.actionToExecute)) {
        confirmModal('hide');
        return performAction();
      }
    };

    init();

  });
