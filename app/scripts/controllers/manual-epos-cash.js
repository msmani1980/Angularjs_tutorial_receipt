'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposCashCtrl
 * @description
 * # ManualEposCashCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposCashCtrl', function ($scope, $routeParams, $q, manualEposFactory, dateUtility, globalMenuService, lodash) {

    //function showLoadingModal(text) {
    //  angular.element('#loading').modal('show').find('p').text(text);
    //}

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

    function setBaseCurrency(currencyList) {
      $scope.baseCurrency = {};
      $scope.baseCurrency.currencyId = globalMenuService.getCompanyData().baseCurrencyId;
      $scope.baseCurrency.currencyCode = lodash.findWhere(currencyList, { id: $scope.baseCurrency.currencyId });
    }

    function mergeCashBagCash(cashBagCashList) {
      angular.forEach(cashBagCashList, function (cashBagCash) {
        var currencyIndex = lodash.findIndex($scope.currencyList, { currencyId: cashBagCash.currencyId });
        $scope.currencyList[currencyIndex].amount = cashBagCash.amount;
        $scope.currencyList[currencyIndex].convertedAmount = cashBagCash.convertedAmount;
      });
    }

    function setCashBagCurrencyList(cashBagCashList, currencyList, dailyExchangeRates) {
      $scope.currencyList = [];
      var cashBagCurrencyList = $scope.cashBag.cashBagCurrencies || [];

      angular.forEach(cashBagCurrencyList, function (currency) {
        var newCurrencyObject = {};
        newCurrencyObject.currencyId = currency.currencyId;
        newCurrencyObject.currencyCode = lodash.findWhere(currencyList, { id: currency.currencyId }).currencyCode || '';
        newCurrencyObject.exchangeRate = lodash.findWhere(dailyExchangeRates, { retailCompanyCurrencyId: currency.currencyId }) || {};
        $scope.currencyList.push(newCurrencyObject);
      });

      mergeCashBagCash(cashBagCashList);
    }

    function completeInit(responseCollection) {
      var currencyList = angular.copy(responseCollection[0].response);
      setBaseCurrency(currencyList);
      setCashBagCurrencyList(angular.copy(responseCollection[1].response), currencyList, angular.copy(responseCollection[2].dailyExchangeRateCurrencies));
    }

    function getInitDependencies(cashBagDataFromAPI) {
      $scope.cashBag = angular.copy(cashBagDataFromAPI);
      var promises = [
        manualEposFactory.getCurrencyList(),
        manualEposFactory.getCashBagCashList($routeParams.cashBagId, {}),
        manualEposFactory.getDailyExchangeRate($scope.cashBag.dailyExchangeRateId)
      ];

      $q.all(promises).then(completeInit, showErrors);
    }

    function init() {
      manualEposFactory.getCashBag($routeParams.cashBagId).then(getInitDependencies, showErrors);
    }

    init();

  });
