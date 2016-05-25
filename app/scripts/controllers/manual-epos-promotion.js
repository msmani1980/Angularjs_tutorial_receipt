'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposPromotionCtrl
 * @description
 * # ManualEposPromotionCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
.controller('ManualEposPromotionCtrl', function ($scope, $routeParams, $q, manualEposFactory, dateUtility, globalMenuService,
  lodash, messageService, $location) {

  function saveSuccess() {
    hideLoadingModal();
    if ($scope.shouldExit) {
      $location.path('manual-epos-dashboard/' + $routeParams.cashBagId);
    }

    messageService.success('Manual promotion data successfully saved!');
  }

  function updateCashBagPromotion(promotion) {
    var payload = {
      id: promotion.id,
      cashbagId: promotion.cashbagId,
      currencyId: promotion.currencyId,
      amount: promotion.amount,
      quantity: promotion.quantity,
      convertedAmount: promotion.baseCurrencyAmount
    };

    return manualEposFactory.updateManualEposPromotion($routeParams.cashBagId, promotion.id, payload);
  }

  function createCashBagPromotion(promotion) {
    var payload = {
      cashbagId: promotion.cashbagId,
      currencyId: promotion.currencyId,
      amount: promotion.amount,
      quantity: promotion.quantity,
      convertedAmount: promotion.baseCurrencyAmount
    };

    return manualEposFactory.createManualEposPromotion($routeParams.cashBagId, payload);
  }

  function addToPromises (promotionList, promises) {
    angular.forEach(promotionList, function (promotion) {
      if (promotion.id) {
        promises.push(updateCashBagPromotion(promotion));
      } else {
        promises.push(createCashBagPromotion(promotion));
      }
    });
  }

  $scope.save = function () {
    showLoadingModal('Saving');
    var promises = [];
    addToPromises($scope.promotionList, promises);
    $q.all(promises).then(saveSuccess, showErrors);
  };

  $scope.setShouldExit = function (shouldExit) {
    $scope.shouldExit = shouldExit;
  };

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

  function setVerifiedData(verifiedDataFromAPI) {
    $scope.isVerified = (!!verifiedDataFromAPI.discountVerifiedOn) || false;
    if (!$scope.isVerified) {
      $scope.verifiedInfo = {};
      return;
    }

    var dateAndTime = dateUtility.formatTimestampForApp(verifiedDataFromAPI.discountVerifiedOn);
    $scope.verifiedInfo = {
      verifiedBy: (verifiedDataFromAPI.discountVerifiedBy) ? verifiedDataFromAPI.discountVerifiedBy.firstName + ' ' + verifiedDataFromAPI.discountVerifiedBy.lastName : 'Unknown User',
      verifiedTimestamp: (!!dateAndTime) ? dateAndTime.replace(' ', ' at ') : 'Unknown Date'
    };
  }

  function verifyToggleSuccess(dataFromAPI) {
    setVerifiedData(angular.copy(dataFromAPI));
    hideLoadingModal();
  }

  $scope.verify = function () {
    showLoadingModal('Verifying');
    manualEposFactory.verifyCashBag($routeParams.cashBagId, 'PROMO').then(verifyToggleSuccess, showErrors);
  };

  $scope.unverify = function () {
    showLoadingModal('Unverifying');
    manualEposFactory.unverifyCashBag($routeParams.cashBagId, 'PROMO').then(verifyToggleSuccess, showErrors);
  };

  function setBaseCurrency() {
    $scope.baseCurrency = {};
    $scope.baseCurrency.currencyId = globalMenuService.getCompanyData().baseCurrencyId;
    $scope.baseCurrency.currency = lodash.findWhere($scope.currencyList, { currencyId: $scope.baseCurrency.currencyId });
  }

  function setCashBagCurrencyList(currencyList) {
    $scope.currencyList = [];
    angular.forEach(currencyList, function (currency) {
      var newCurrencyObject = {};
      newCurrencyObject.currencyId = currency.id;
      newCurrencyObject.code = currency.code || '';
      newCurrencyObject.name = currency.name || '';
      newCurrencyObject.exchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: currency.id }) || {};
      $scope.currencyList.push(newCurrencyObject);
    });
  }

  function setInitialCurreny (discount) {
    if (!$scope.selectedCurrency.currency) {
      $scope.selectedCurrency.currency = lodash.findWhere($scope.currencyList, { currencyId: discount.currencyId }) || {};
    }
  }

  function setPromotionsList(promotionList) {
    $scope.promotionList = [];
    angular.forEach(promotionList, function (promotion) {
      promotion.exchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: promotion.currencyId }) || {};

      //promotion.currentCurrencyAmount = getCurrentCurrencyAmount(promotion);
      //promotion.baseCurrencyAmount = getBaseCurrencyAmount(promotion);
      $scope.promotionList.push(angular.copy(promotion));
      setInitialCurreny(promotion);
    });
  }

  function completeInit(responseCollection) {
    console.log('responseCollection', responseCollection);
    hideLoadingModal();
    var currencyList = angular.copy(responseCollection[0].response);
    var promotionList = angular.copy(responseCollection[1].response);
    var dailyExchangeRate = angular.copy(responseCollection[2].dailyExchangeRateCurrencies);
    var verifiedData = angular.copy(responseCollection[3]);

    $scope.dailyExchangeRates =  dailyExchangeRate;
    setCashBagCurrencyList(currencyList);
    setBaseCurrency();
    setVerifiedData(verifiedData);
    setPromotionsList(promotionList);
  }

  function getInitDependencies(storeInstanceDataFromAPI) {
    console.log('storeInstanceDataFromAPI', storeInstanceDataFromAPI);
    $scope.storeInstance = angular.copy(storeInstanceDataFromAPI);
    $scope.selectedCurrency = {};
    var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));

    var promises = [
      manualEposFactory.getCurrencyList({ startDate: dateForFilter, endDate: dateForFilter,  isOperatedCurrency: true }),
      manualEposFactory.getManualEposPromotionList($routeParams.cashBagId),
      manualEposFactory.getDailyExchangeRate($scope.cashBag.dailyExchangeRateId),
      manualEposFactory.checkCashBagVerification($routeParams.cashBagId)
    ];

    $q.all(promises).then(completeInit, showErrors);
  }

  function getStoreInstanceThenContinueInit(cashBagDataFromAPI) {
    $scope.cashBag = angular.copy(cashBagDataFromAPI);
    console.log('$scope.cashBag', $scope.cashBag);

    if ($scope.cashBag.storeInstanceId) {
      manualEposFactory.getStoreInstance($scope.cashBag.storeInstanceId).then(getInitDependencies, showErrors);
    } else {
      getInitDependencies(null);
    }
  }

  function init() {
    showLoadingModal('Loading data');
    console.log('$routeParams.cashbagId', $routeParams.cashbagId);
    manualEposFactory.getCashBag($routeParams.cashbagId).then(getStoreInstanceThenContinueInit, showErrors);
  }

  init();

});
