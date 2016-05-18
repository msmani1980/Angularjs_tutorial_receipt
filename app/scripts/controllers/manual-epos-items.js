'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposVirtualCtrl
 * @description
 * # ManualEposVirtualCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposItemsCtrl', function ($scope, $q, $routeParams, manualEposFactory, lodash, dateUtility, globalMenuService, messageService, $location) {

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
      $scope.disableAll = true;
    }

    function updateCashBagItem(item) {
      var payload = {
        itemMasterId: item.itemMasterId,
        currencyId: $scope.selectedCurrency.currency.id,
        itemTypeId: $scope.mainItemType.id,
        amount: parseFloat(item.amount) || 0,
        quantity: parseFloat(item.quantity) || 0,
        convertedAmount: parseFloat(item.convertedTotal) || 0
      };

      return manualEposFactory.updateCashBagItem($routeParams.cashBagId, item.id, payload);
    }

    function createCashBagItem(item) {
      var payload = {
        itemMasterId: item.itemMasterId,
        currencyId: $scope.selectedCurrency.currency.id,
        itemTypeId: $scope.mainItemType.id,
        amount: parseFloat(item.amount) || 0,
        quantity: parseFloat(item.quantity) || 0,
        convertedAmount: parseFloat(item.convertedTotal) || 0
      };

      return manualEposFactory.createCashBagItem($routeParams.cashBagId, payload);
    }

    function saveSuccess() {
      hideLoadingModal();
      if ($scope.shouldExit) {
        $location.path('manual-epos-dashboard/' + $routeParams.cashBagId);
      }

      init();
      messageService.success('Manual ' + $routeParams.itemType + ' item data successfully saved!');
    }

    $scope.save = function () {
      if (!$scope.manualItemForm.$valid) {
        showErrors();
        $scope.disableAll = false;
        return;
      }

      showLoadingModal('Saving');
      var promises = [];
      angular.forEach($scope.itemList, function (item) {
        if (item.id) {
          promises.push(updateCashBagItem(item));
        } else {
          promises.push(createCashBagItem(item));
        }
      });

      $q.all(promises).then(saveSuccess, showErrors);
    };

    $scope.setShouldExit = function (shouldExit) {
      $scope.shouldExit = shouldExit;
    };

    function convertAmountFromBaseCurrency(amount, exchangeRateObject) {
      var convertedAmount = 0;

      if (exchangeRateObject.bankExchangeRate === null) {
        var paperExchangeRate = exchangeRateObject.paperExchangeRate;
        var coinExchangeRate = exchangeRateObject.coinExchangeRate;
        var splitAmounts = (amount.toString()).split('.');
        var convertedPaperAmount = parseFloat(splitAmounts[0]) * paperExchangeRate;
        var convertedCoinAmount = parseFloat(splitAmounts[1]) * coinExchangeRate;
        convertedAmount = convertedPaperAmount + (convertedCoinAmount / 100);
      } else {
        var exchangeRate = exchangeRateObject.bankExchangeRate;
        convertedAmount = parseFloat(amount) * exchangeRate;
      }

      return convertedAmount.toFixed(2);
    }

    function convertAmountToBaseCurrency(amount, exchangeRateObject) {
      var convertedAmount = 0;

      if (exchangeRateObject.bankExchangeRate === null) {
        var paperExchangeRate = exchangeRateObject.paperExchangeRate;
        var coinExchangeRate = exchangeRateObject.coinExchangeRate;
        var splitAmounts = (amount.toString()).split('.');
        var convertedPaperAmount = parseFloat(splitAmounts[0]) / paperExchangeRate;
        var convertedCoinAmount = parseFloat(splitAmounts[1]) / coinExchangeRate;
        convertedAmount = convertedPaperAmount + (convertedCoinAmount / 100);
      } else {
        var exchangeRate = exchangeRateObject.bankExchangeRate;
        convertedAmount = parseFloat(amount) / exchangeRate;
      }

      return convertedAmount.toFixed(2);
    }

    $scope.sumAllItems = function () {
      var sum = 0;
      angular.forEach($scope.itemList, function (item) {
        sum += parseFloat(item.convertedTotal);
      });

      return sum.toFixed(2);
    };

    $scope.calculateTotals = function (item) {
      var total = (item.amount && item.quantity) ? parseFloat(item.amount) * parseInt(item.quantity) : 0;
      var stringTotal = total.toFixed(2);
      item.totalValue = stringTotal;
      item.convertedTotal = (item.exchangeRate) ? convertAmountToBaseCurrency(total, item.exchangeRate) : '0.00';
      return stringTotal;
    };

    $scope.updateAmountsWithSelectedCurrency = function () {
      var newCurrencyId = $scope.selectedCurrency.currency.id;
      angular.forEach($scope.itemList, function (item) {
        if (!item.amount || !angular.isDefined(item.currencyId)) {
          item.currencyId = $scope.baseCurrency.id;
          item.exchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: item.currencyId });
          return;
        }

        var oldExchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: item.currencyId });
        var newExchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: newCurrencyId });

        var baseAmount = convertAmountToBaseCurrency(item.amount, oldExchangeRate);
        var convertedAmount = convertAmountFromBaseCurrency(baseAmount, newExchangeRate);

        item.amount = convertedAmount;
        item.currencyId = newCurrencyId;
        item.exchangeRate = newExchangeRate;
        $scope.calculateTotals(item);
      });
    };

    function setVerifiedData(verifiedDataFromAPI) {
      var verifiedKeys = {
        verifiedBy: ($routeParams.itemType.toLowerCase() === 'virtual') ? 'virtualItemVerifiedBy' : 'voucherItemsVerifiedBy',
        verifiedOn: ($routeParams.itemType.toLowerCase() === 'virtual') ? 'virtualItemVerifiedOn' : 'voucherItemsVerifiedOn'
      };

      $scope.isVerified = (!!verifiedDataFromAPI[verifiedKeys.verifiedBy]);
      var dateAndTime = dateUtility.formatTimestampForApp(verifiedDataFromAPI[verifiedKeys.verifiedOn]);
      $scope.verifiedInfo = {
        verifiedBy: (verifiedDataFromAPI[verifiedKeys.verifiedBy]) ? verifiedDataFromAPI[verifiedKeys.verifiedBy].firstName + ' ' + verifiedDataFromAPI[verifiedKeys.verifiedBy].lastName : 'Unknown User',
        verifiedTimestamp: dateAndTime || 'Unknown Date'
      };
    }

    $scope.verify = function (shouldCheckForm) {
      angular.element('#confirmation-modal').modal('hide');
      if (shouldCheckForm && $scope.manualItemForm.$dirty) {
        angular.element('#confirmation-modal').modal('show');
        return;
      }

      showLoadingModal('Verifying');
      var verificationKey = ($routeParams.itemType.toLowerCase() === 'virtual') ? 'VIRT_ITEM' : 'VOUCH_ITEM';
      manualEposFactory.verifyCashBag($routeParams.cashBagId, verificationKey).then(init, showErrors);
    };

    $scope.unverify = function () {
      showLoadingModal('Unverifying');
      var verificationKey = ($routeParams.itemType.toLowerCase() === 'virtual') ? 'VIRT_ITEM' : 'VOUCH_ITEM';
      manualEposFactory.unverifyCashBag($routeParams.cashBagId, verificationKey).then(init, showErrors);
    };

    function setItemList(masterItemList, cashBagItemList) {
      $scope.itemList = [];

      angular.forEach(masterItemList, function (item) {
        var newItemObject = {
          itemName: item.itemName,
          itemCode: item.itemCode,
          itemDescription: item.itemCode + ' - ' + item.itemName,
          itemMasterId: item.id
        };

        var cashBagItemMatch = lodash.findWhere(cashBagItemList, { itemMasterId: item.id, itemTypeId: $scope.mainItemType.id });
        if (cashBagItemMatch) {
          newItemObject.id = cashBagItemMatch.id;
          newItemObject.currencyId = cashBagItemMatch.currencyId;
          newItemObject.amount = cashBagItemMatch.amount;
          newItemObject.quantity = cashBagItemMatch.quantity;
          var currencyObject = lodash.findWhere($scope.currencyList, { id: cashBagItemMatch.currencyId });
          $scope.selectedCurrency.currency = $scope.selectedCurrency.currency || currencyObject;
        }

        $scope.itemList.push(newItemObject);
      });
    }

    function setBaseCurrency() {
      var baseCurrencyId = globalMenuService.getCompanyData().baseCurrencyId;
      var baseCurrencyObject = lodash.findWhere($scope.currencyList, { id: baseCurrencyId });
      $scope.baseCurrency = baseCurrencyObject || {};
      $scope.selectedCurrency.currency = $scope.selectedCurrency.currency || baseCurrencyObject;
    }

    function completeInit(responseCollection) {
      var masterItemList = angular.copy(responseCollection[0].masterItems);
      var cashBagItemList = angular.copy(responseCollection[1].response);
      $scope.currencyList = angular.copy(responseCollection[2].response);
      $scope.dailyExchangeRates = angular.copy(responseCollection[3].dailyExchangeRateCurrencies);

      setItemList(masterItemList, cashBagItemList);
      setBaseCurrency();
      setVerifiedData(angular.copy(responseCollection[4]));
      $scope.updateAmountsWithSelectedCurrency();
      $scope.disableAll = false;
      $scope.manualItemForm.$setPristine();
      hideLoadingModal();
    }

    function makeSecondInitPromises() {
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));
      var currencyPayload = {
        startDate: dateForFilter,
        endDate: dateForFilter
      };

      var itemListPayload = angular.extend(angular.copy(currencyPayload), { itemTypeId: $scope.mainItemType.id });

      var promises = [
        manualEposFactory.getRetailItems(itemListPayload),
        manualEposFactory.getCashBagItemList($routeParams.cashBagId),
        manualEposFactory.getCurrencyList(currencyPayload),
        manualEposFactory.getDailyExchangeRate($scope.cashBag.dailyExchangeRateId),
        manualEposFactory.checkCashBagVerification($routeParams.cashBagId)
      ];

      return promises;
    }

    function completeInitCalls(dataFromAPI) {
      $scope.storeInstance = angular.copy(dataFromAPI);
      var secondInitPromises = makeSecondInitPromises();
      $q.all(secondInitPromises).then(completeInit);
    }

    function setInitVarsAndGetStoreInstance(responseCollection) {
      $scope.cashBag = angular.copy(responseCollection[0]);
      var itemTypes = angular.copy(responseCollection[1]);
      var capitalizedItemType = $routeParams.itemType.charAt(0).toUpperCase() + $routeParams.itemType.slice(1).toLowerCase();
      $scope.mainItemType = lodash.findWhere(itemTypes, { name: capitalizedItemType }) || '';

      manualEposFactory.getStoreInstance($scope.cashBag.storeInstanceId).then(completeInitCalls);
    }

    function setupVars() {
      $scope.selectedCurrency = {};
      $scope.disableAll = true;
      $scope.isVerified = false;
    }

    function init() {
      showLoadingModal();
      setupVars();

      var firstInitPromises = [
        manualEposFactory.getCashBag($routeParams.cashBagId),
        manualEposFactory.getItemTypes()
      ];

      $q.all(firstInitPromises).then(setInitVarsAndGetStoreInstance);
    }

    init();
  });
