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
        var convertedCoinAmount = (!!splitAmounts[1]) ? parseFloat(splitAmounts[1]) / coinExchangeRate : 0;
        convertedAmount = convertedPaperAmount + (convertedCoinAmount / 100);
      } else {
        var exchangeRate = currencyObject.exchangeRate.bankExchangeRate;
        convertedAmount = parseFloat(currencyObject.amount) / exchangeRate;
      }

      currencyObject.convertedAmount = convertedAmount.toFixed(2);
      return convertedAmount.toFixed(2);
    };

    function setVerifiedInfo(verifiedDataFromAPI) {
      if (!$scope.isVerified) {
        $scope.verifiedInfo = {};
        return;
      }

      var dateAndTime = dateUtility.formatTimestampForApp(verifiedDataFromAPI.creditCardVerifiedOn);
      $scope.verifiedInfo = {
        verifiedBy: (verifiedDataFromAPI.creditCardVerifiedBy) ? verifiedDataFromAPI.creditCardVerifiedBy.firstName + ' ' + verifiedDataFromAPI.creditCardVerifiedBy.lastName : 'Unknown User',
        verifiedTimestamp: (!!dateAndTime) ? dateAndTime.replace(' ', ' at ') : 'Unknown Date'
      };
    }

    function setVerifiedData(verifiedDataFromAPI) {
      $scope.isVerified = (!!verifiedDataFromAPI.creditCardVerifiedOn) || false;
      $scope.isCashBagConfirmed = (!!verifiedDataFromAPI.verificationConfirmedOn) || false;
      setVerifiedInfo(verifiedDataFromAPI);
    }

    $scope.verify = function (shouldCheckForm) {
      angular.element('#confirmation-modal').modal('hide');
      if (shouldCheckForm && $scope.manualCreditForm.$dirty) {
        angular.element('#confirmation-modal').modal('show');
        return;
      }

      showLoadingModal('Verifying');
      manualEposFactory.verifyCashBag($routeParams.cashBagId, 'CREDIT').then(init, showErrors);
    };

    $scope.unverify = function () {
      showLoadingModal('Unverifying');
      manualEposFactory.unverifyCashBag($routeParams.cashBagId, 'CREDIT').then(init, showErrors);
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

    function saveSuccess() {
      hideLoadingModal();
      if ($scope.shouldExit) {
        $location.path('manual-epos-dashboard/' + $routeParams.cashBagId);
      }

      init();
      messageService.success('Manual cash data successfully saved!');
    }

    $scope.save = function () {
      if (!$scope.manualCreditForm.$valid) {
        showErrors();
        $scope.disableAll = false;
        return;
      }

      showLoadingModal('Saving');
      var promises = [];
      angular.forEach($scope.currencyList, function (cash) {
        if (cash.id) {
          promises.push(updateCashBagCredit(cash));
        } else {
          promises.push(createCashBagCredit(cash));
        }
      });

      $q.all(promises).then(saveSuccess, showErrors);
    };

    $scope.setShouldExit = function (shouldExit) {
      $scope.shouldExit = shouldExit;
    };

    function setBaseCurrency(currencyList) {
      var baseCurrencyId = globalMenuService.getCompanyData().baseCurrencyId;
      var baseCurrencyObject = lodash.findWhere(currencyList, { id: baseCurrencyId });
      $scope.baseCurrency = baseCurrencyObject || {};
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
      setVerifiedData(angular.copy(responseCollection[3]));
      $scope.manualCreditForm.$setPristine();
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
