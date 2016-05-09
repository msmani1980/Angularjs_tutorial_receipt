'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposCreditCtrl
 * @description
 * # ManualEposCashCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposCreditCtrl', function ($scope, $routeParams, $q, manualEposFactory, dateUtility, globalMenuService,
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

    function verifyToggleSuccess() {
      hideLoadingModal();
      $scope.isVerified = !$scope.isVerified;
    }

    $scope.verify = function () {
      showLoadingModal('Verifying');
      manualEposFactory.verifyCashBag($routeParams.cashBagId, 'CREDIT').then(verifyToggleSuccess, showErrors);
    };

    $scope.unverify = function () {
      showLoadingModal('Verifying');
      manualEposFactory.unverifyCashBag($routeParams.cashBagId, 'CREDIT').then(verifyToggleSuccess, showErrors);
    };

    function updateCashBagCredit(credit) {
      var payload = {
        currencyId: credit.currencyId,
        amount: parseFloat(credit.amount) || 0,
        convertedAmount: parseFloat(credit.convertedAmount) || 0
      };

      return manualEposFactory.updateCashBagCredit($routeParams.cashBagId, credit.id, payload);
    }

    function createCashBagCredit(credit) {
      var payload = {
        currencyId: credit.currencyId,
        amount: parseFloat(credit.amount) || 0,
        convertedAmount: parseFloat(credit.convertedAmount) || 0
      };

      return manualEposFactory.createCashBagCredit($routeParams.cashBagId, payload);
    }

    function saveSuccess(shouldExit) {
      hideLoadingModal();
      if (shouldExit) {
        $location.path('manual-epos-dashboard/' + $routeParams.cashBagId);
      }

      messageService.success('Manual cash data successfully saved!');
    }

    $scope.save = function (shouldExit) {
      showLoadingModal('Saving');
      var promises = [];
      angular.forEach($scope.currencyList, function (cash) {
        if (cash.id) {
          promises.push(updateCashBagCredit(cash));
        } else {
          promises.push(createCashBagCredit(cash));
        }
      });

      $q.all(promises).then(function () {
        saveSuccess(shouldExit);
      }, showErrors);
    };

    function setBaseCurrency(currencyList) {
      $scope.baseCurrency = {};
      $scope.baseCurrency.currencyId = globalMenuService.getCompanyData().baseCurrencyId;
      $scope.baseCurrency.currencyCode = lodash.findWhere(currencyList, { id: $scope.baseCurrency.currencyId });
    }

    function mergeCashBagCredit(cashBagCreditList) {
      angular.forEach(cashBagCreditList, function (cashBagCredit) {
        var currencyIndex = lodash.findIndex($scope.currencyList, { currencyId: cashBagCredit.currencyId });

        if (currencyIndex >= 0) {
          $scope.currencyList[currencyIndex].amount = cashBagCredit.amount.toFixed(2);
          $scope.currencyList[currencyIndex].convertedAmount = cashBagCredit.convertedAmount;
          $scope.currencyList[currencyIndex].id = cashBagCredit.id;
        }
      });
    }

    function setCashBagCurrencyList(cashBagCreditList, currencyList, dailyExchangeRates) {
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

      mergeCashBagCredit(cashBagCreditList);
    }

    function completeInit(responseCollection) {
      hideLoadingModal();
      var currencyList = angular.copy(responseCollection[0].response);
      setBaseCurrency(currencyList);
      setCashBagCurrencyList(angular.copy(responseCollection[1].response), currencyList, angular.copy(responseCollection[2].dailyExchangeRateCurrencies));
      $scope.isVerified = angular.copy(responseCollection[3].creditVerifiedOn) || false;
    }

    function getInitDependencies(storeInstanceDataFromAPI) {
      $scope.storeInstance = angular.copy(storeInstanceDataFromAPI);
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));

      var promises = [
        manualEposFactory.getCurrencyList({ startDate: dateForFilter, endDate: dateForFilter }),
        manualEposFactory.getCashBagCreditList($routeParams.cashBagId, {}),
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
