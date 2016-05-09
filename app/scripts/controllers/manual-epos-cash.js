'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposCashCtrl
 * @description
 * # ManualEposCashCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposCashCtrl', function ($scope, $routeParams, $q, manualEposFactory, dateUtility, globalMenuService,
                                              lodash, messageService, $location) {

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

    $scope.sumConvertedAmounts = function () {
      var runningSum = 0;
      angular.forEach($scope.currencyList, function (currency) {
        var convertedAmount = currency.convertedAmount || 0;
        runningSum += parseFloat(convertedAmount);
      });

      return parseFloat(runningSum).toFixed(2);
    };

    $scope.convertAmount = function (currencyObject) {
      var convertedAmount = 0;
      if (!currencyObject.amount) {
        currencyObject.convertedAmount = '0.00';
        return '0.00';
      }

      if (currencyObject.exchangeRate.bankExchangeRate === null) {
        var paperExchangeRate = currencyObject.exchangeRate.paperExchangeRate;
        var coinExchangeRate = currencyObject.exchangeRate.coinExchangeRate;
        var splitAmounts = (currencyObject.amount.toString()).split('.');
        var convertedPaperAmount = parseFloat(splitAmounts[0]) / paperExchangeRate;
        var convertedCoinAmount = parseFloat(splitAmounts[1]) / coinExchangeRate;
        convertedAmount = convertedPaperAmount + (convertedCoinAmount / 100);
      } else {
        var exchangeRate = currencyObject.exchangeRate.bankExchangeRate;
        convertedAmount = parseFloat(currencyObject.amount) / exchangeRate;
      }

      currencyObject.convertedAmount = convertedAmount.toFixed(2);
      return convertedAmount.toFixed(2);
    };

    function setVerifiedData (verifiedDataFromAPI) {
      $scope.isVerified = (!!verifiedDataFromAPI.creditCardVerifiedOn) || false;
      if(!$scope.isVerified) {
        $scope.verifiedInfo = {};
        return;
      }

      var dateAndTime = dateUtility.formatTimestampForApp(verifiedDataFromAPI.cashVerifiedOn);
      $scope.verifiedInfo = {
        verifiedBy: (verifiedDataFromAPI.cashVerifiedBy) ? verifiedDataFromAPI.cashVerifiedBy.firstName + ' ' + verifiedDataFromAPI.cashVerifiedBy.lastName :  'Unknown User',
        verifiedTimestamp: (!!dateAndTime) ? dateAndTime.replace(' ', ' at ') : 'Unknown Date'
      };
    }

    function verifyToggleSuccess(dataFromAPI) {
      setVerifiedData(angular.copy(dataFromAPI));
      hideLoadingModal();
    }

    $scope.verify = function () {
      showLoadingModal('Verifying');
      manualEposFactory.verifyCashBag($routeParams.cashBagId, 'CASH').then(verifyToggleSuccess, showErrors);
    };

    $scope.unverify = function () {
      showLoadingModal('Verifying');
      manualEposFactory.unverifyCashBag($routeParams.cashBagId, 'CASH').then(verifyToggleSuccess, showErrors);
    };

    function updateCashBagCash(cash) {
      var payload = {
        currencyId: cash.currencyId,
        amount: parseFloat(cash.amount) || 0,
        convertedAmount: parseFloat(cash.convertedAmount) || 0
      };

      return manualEposFactory.updateCashBagCash($routeParams.cashBagId, cash.id, payload);
    }

    function createCashBagCash(cash) {
      var payload = {
        currencyId: cash.currencyId,
        amount: parseFloat(cash.amount) || 0,
        convertedAmount: parseFloat(cash.convertedAmount) || 0
      };

      return manualEposFactory.createCashBagCash($routeParams.cashBagId, payload);
    }

    function saveSuccess() {
      hideLoadingModal();
      if ($scope.shouldExit) {
        $location.path('manual-epos-dashboard/' + $routeParams.cashBagId);
      }

      messageService.success('Manual cash data successfully saved!');
    }

    $scope.save = function () {
      showLoadingModal('Saving');
      var promises = [];
      angular.forEach($scope.currencyList, function (cash) {
        if (cash.id) {
          promises.push(updateCashBagCash(cash));
        } else {
          promises.push(createCashBagCash(cash));
        }
      });

      $q.all(promises).then(saveSuccess, showErrors);
    };

    $scope.setShouldExit = function (shouldExit) {
      $scope.shouldExit = shouldExit;
    };

    function setBaseCurrency(currencyList) {
      $scope.baseCurrency = {};
      $scope.baseCurrency.currencyId = globalMenuService.getCompanyData().baseCurrencyId;
      $scope.baseCurrency.currencyCode = lodash.findWhere(currencyList, { id: $scope.baseCurrency.currencyId });
    }

    function mergeCashBagCash(cashBagCashList) {
      angular.forEach(cashBagCashList, function (cashBagCash) {
        var currencyIndex = lodash.findIndex($scope.currencyList, { currencyId: cashBagCash.currencyId });

        if (currencyIndex >= 0) {
          $scope.currencyList[currencyIndex].amount = cashBagCash.amount.toFixed(2);
          $scope.currencyList[currencyIndex].convertedAmount = cashBagCash.convertedAmount;
          $scope.currencyList[currencyIndex].id = cashBagCash.id;
        }
      });
    }

    function setCashBagCurrencyList(cashBagCashList, currencyList, dailyExchangeRates) {
      $scope.currencyList = [];
      var cashBagCurrencyList = $scope.cashBag.cashBagCurrencies || [];

      angular.forEach(cashBagCurrencyList, function (currency) {
        var newCurrencyObject = {};
        var currencyListMatch = lodash.findWhere(currencyList, { id: currency.currencyId });
        if (currencyListMatch) {
          newCurrencyObject.currencyId = currency.currencyId;
          newCurrencyObject.currencyCode = currencyListMatch.code || '';
          newCurrencyObject.exchangeRate = lodash.findWhere(dailyExchangeRates, { retailCompanyCurrencyId: currency.currencyId }) || {};
          $scope.currencyList.push(newCurrencyObject);
        }
      });

      mergeCashBagCash(cashBagCashList);
    }

    function completeInit(responseCollection) {
      hideLoadingModal();
      var currencyList = angular.copy(responseCollection[0].response);
      setBaseCurrency(currencyList);
      setCashBagCurrencyList(angular.copy(responseCollection[1].response), currencyList, angular.copy(responseCollection[2].dailyExchangeRateCurrencies));
      setVerifiedData(angular.copy(responseCollection[3]));
    }

    function getInitDependencies(storeInstanceDataFromAPI) {
      $scope.storeInstance = angular.copy(storeInstanceDataFromAPI);
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));

      var promises = [
        manualEposFactory.getCurrencyList({ startDate: dateForFilter, endDate: dateForFilter }),
        manualEposFactory.getCashBagCashList($routeParams.cashBagId, {}),
        manualEposFactory.getDailyExchangeRate($scope.cashBag.dailyExchangeRateId),
        manualEposFactory.checkCashBagVerification($routeParams.cashBagId)
      ];

      $q.all(promises).then(completeInit, showErrors);
    }

    function getStoreInstanceThenContinueInit(cashBagDataFromAPI) {
      $scope.cashBag = angular.copy(cashBagDataFromAPI);

      if ($scope.cashBag.storeInstanceId) {
        manualEposFactory.getStoreInstance($scope.cashBag.storeInstanceId).then(getInitDependencies, showErrors);
      } else {
        getInitDependencies(null);
      }
    }

    function init() {
      showLoadingModal('Loading data');
      manualEposFactory.getCashBag($routeParams.cashBagId).then(getStoreInstanceThenContinueInit, showErrors);
    }

    init();

  });
