'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposVirtualCtrl
 * @description
 * # ManualEposVirtualCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposItemsCtrl', function ($scope, $q, $routeParams, manualEposFactory, lodash, dateUtility, globalMenuService) {

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

    // TODO: note, conversions here should always to base currency
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

    $scope.updateAmountsWithSelectedCurrency = function () {
      var newCurrencyId = $scope.selectedCurrency.currency.id;
      angular.forEach($scope.itemList, function (item) {
        if (parseFloat(item.amount) === 0 || !angular.isDefined(item.currencyId)) {
          item.amount = '0.00';
          return;
        }

        var oldExchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: item.currencyId });
        var newExchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: newCurrencyId });

        var baseAmount = convertAmountToBaseCurrency(item.amount, oldExchangeRate);
        var convertedAmount = convertAmountFromBaseCurrency(baseAmount, newExchangeRate);

        item.amount = convertedAmount;
        item.currencyId = newCurrencyId;
      });
    };

    function setItemList(masterItemList, cashBagItemList) {
      $scope.itemList = [];

      angular.forEach(masterItemList, function (item) {
        var newItemObject = {
          itemName: item.itemName,
          itemCode: item.itemCode,
          itemDescription: item.itemCode + ' - ' + item.itemName,
          itemMasterId: item.id,
          amount: '0.00',
          quantity: 0
        };

        var cashBagItemMatch = lodash.findWhere(cashBagItemList, { itemMasterId: item.id, itemTypeId: $scope.mainItemType.id });
        if (cashBagItemMatch) {
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
      $scope.updateAmountsWithSelectedCurrency();
      console.log($scope.itemList);
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
        manualEposFactory.getDailyExchangeRate($scope.cashBag.dailyExchangeRateId)
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

    function init() {
      $scope.selectedCurrency = {};

      var firstInitPromises = [
        manualEposFactory.getCashBag($routeParams.cashBagId),
        manualEposFactory.getItemTypes()
      ];

      $q.all(firstInitPromises).then(setInitVarsAndGetStoreInstance);
    }

    init();
  });
