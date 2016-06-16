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

    $scope.addPromotion = function () {
      var newPromotion = {
        cashbagId: $scope.cashBag.id,
        eposCashBagsId: $scope.cashBag.eposCashBagsId,
        storeInstanceId: $scope.cashBag.storeInstanceId,
        promotionId: null,
        promotion: null,
        id: null,
        currencyId: $scope.selectedCurrency.currency.currencyId,
        currency: $scope.selectedCurrency.currency,
        amount: 0.00,
        quantity: 0,
        currentCurrencyAmount: 0.00,
        baseCurrencyAmount: 0.00,
        exchangeRate: $scope.selectedCurrency.currency.exchangeRate,
        companyId: $scope.companyId
      };

      $scope.promotionList.push(newPromotion);
    };

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
        promotionId: promotion.promotionId,
        currencyId: promotion.currencyId,
        amount: promotion.amount,
        quantity: promotion.quantity,
        totalConvertedAmount: promotion.baseCurrencyAmount,
        companyId: $scope.companyId
      };
      return manualEposFactory.updateManualEposPromotion(promotion.id, payload);
    }

    function createCashBagPromotion(promotion) {
      var payload = {
        cashbagId: promotion.cashbagId,
        promotionId: promotion.promotionId,
        currencyId: promotion.currencyId,
        amount: promotion.amount,
        quantity: promotion.quantity,
        totalConvertedAmount: promotion.baseCurrencyAmount,
        companyId: $scope.companyId
      };
      return manualEposFactory.createManualEposPromotion(payload);
    }

    function addToPromises(promotionList, promises) {
      angular.forEach(promotionList, function (promotion) {
        if (promotion.id) {
          promises.push(updateCashBagPromotion(promotion));
        } else {
          promises.push(createCashBagPromotion(promotion));
        }
      });
    }

    $scope.onChangePriceOrQty = function (promotionObj) {
      promotionObj.currentCurrencyAmount = getCurrentCurrencyAmount(promotionObj);
      promotionObj.baseCurrencyAmount = getBaseCurrencyAmount(promotionObj);
      return promotionObj;
    };

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

    function setVerifiedInfo(verifiedDataFromAPI) {
      if (!$scope.isVerified) {
        $scope.verifiedInfo = {};
        return;
      }

      var dateAndTime = dateUtility.formatTimestampForApp(verifiedDataFromAPI.promoVerifiedOn);
      $scope.verifiedInfo = {
        verifiedBy: (verifiedDataFromAPI.promoVerifiedBy) ? verifiedDataFromAPI.promoVerifiedBy.firstName + ' ' + verifiedDataFromAPI.promoVerifiedBy.lastName : 'Unknown User',
        verifiedTimestamp: (!!dateAndTime) ? dateAndTime.replace(' ', ' at ') : 'Unknown Date'
      };
    }

    function setVerifiedData(verifiedDataFromAPI) {
      $scope.isVerified = (!!verifiedDataFromAPI.promoVerifiedOn) || false;
      $scope.isCashBagConfirmed = (!!verifiedDataFromAPI.verificationConfirmedOn) || false;
      setVerifiedInfo(verifiedDataFromAPI);
    }

    function verifyToggleSuccess(dataFromAPI) {
      setVerifiedData(angular.copy(dataFromAPI));
      hideLoadingModal();
    }

    $scope.sumAmounts = function () {
      var runningSum = 0;
      angular.forEach($scope.promotionList, function (promotion) {
        var baseCurrencyAmount = promotion.baseCurrencyAmount || 0;
        runningSum += parseFloat(baseCurrencyAmount);
      });

      return parseFloat(runningSum).toFixed(2);
    };

    $scope.verify = function () {
      showLoadingModal('Verifying');
      manualEposFactory.verifyCashBag($scope.cashBag.id, 'PROMO').then(verifyToggleSuccess, showErrors);
    };

    $scope.unverify = function () {
      showLoadingModal('Unverifying');
      manualEposFactory.unverifyCashBag($scope.cashBag.id, 'PROMO').then(verifyToggleSuccess, showErrors);
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

    function setInitialCurreny(promotion) {
      if (!$scope.selectedCurrency.currency) {
        $scope.selectedCurrency.currency = lodash.findWhere($scope.currencyList, { currencyId: promotion.currencyId }) || {};
      }
    }

    function calculateBaseCurrencyAmount(promotionObject) {
      var baseCurrencyAmount = 0.00;
      if (promotionObject.exchangeRate.bankExchangeRate === null) {
        var paperExchangeRate = promotionObject.exchangeRate.paperExchangeRate;
        var coinExchangeRate = promotionObject.exchangeRate.coinExchangeRate;
        if (!paperExchangeRate && !coinExchangeRate) {
          return baseCurrencyAmount.toFixed(2);
        }

        var splitAmounts = (promotionObject.currentCurrencyAmount).split('.');
        var convertedPaperAmount = parseFloat(splitAmounts[0]) / paperExchangeRate;
        var convertedCoinAmount = parseFloat(splitAmounts[1]) / coinExchangeRate;
        baseCurrencyAmount = convertedPaperAmount + (convertedCoinAmount / 100);
      } else {
        var exchangeRate = promotionObject.exchangeRate.bankExchangeRate;
        baseCurrencyAmount = (!exchangeRate ? 0.00 : parseFloat(promotionObject.currentCurrencyAmount) / exchangeRate);
      }

      return baseCurrencyAmount;
    }

    $scope.onChangeCurrency = function () {
      angular.forEach($scope.promotionList, function (promotion) {
        promotion.exchangeRate = $scope.selectedCurrency.currency.exchangeRate;
        promotion.currencyId = $scope.selectedCurrency.currency.currencyId;
        promotion.baseCurrencyAmount = getBaseCurrencyAmount(promotion);
      });
    };

    $scope.onChangePromotion = function (promotionObj) {
      promotionObj.promotionId = promotionObj.companyPromotion.id;
      promotionObj.promotionName = (promotionObj.companyPromotion.promotionName && promotionObj.companyPromotion.promotionName !== null ? promotionObj.companyPromotion.promotionName : '');
      return promotionObj;
    };

    function getBaseCurrencyAmount(promotionObject) {
      var baseCurrencyAmount = 0.00;
      if (!promotionObject.currentCurrencyAmount) {
        return baseCurrencyAmount.toFixed(2);
      }

      if ($scope.baseCurrency.currencyId && promotionObject.currencyId && $scope.baseCurrency.currencyId === promotionObject.currencyId) {
        return promotionObject.currentCurrencyAmount;
      } else {
        baseCurrencyAmount = calculateBaseCurrencyAmount(promotionObject);
      }

      return baseCurrencyAmount.toFixed(2);
    }

    function getCurrentCurrencyAmount(promotion) {
      var сurrencyAmount = 0.00;
      if (!promotion.amount || promotion.amount === null || !promotion.quantity || promotion.quantity === null) {
        return сurrencyAmount.toFixed(2);
      }

      сurrencyAmount = promotion.amount * promotion.quantity;
      return parseFloat(сurrencyAmount).toFixed(2);
    }

    function setPromotionsList(promoList, cmpPromotionsList) {
      var companyPromotionList = angular.copy(cmpPromotionsList.promotions);
      $scope.companyPromotionList = cmpPromotionsList;

      $scope.promotionList = [];
      angular.forEach(promoList, function (promotion) {
        promotion.exchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: promotion.currencyId }) || {};
        promotion.companyPromotion = lodash.findWhere(companyPromotionList, { id: promotion.promotionId }) || {};
        promotion.promotionName = (promotion.companyPromotion.promotionName && promotion.companyPromotion.promotionName !== null ? promotion.companyPromotion.promotionName : '');

        promotion.currentCurrencyAmount = getCurrentCurrencyAmount(promotion);
        promotion.baseCurrencyAmount = getBaseCurrencyAmount(promotion);

        $scope.promotionList.push(angular.copy(promotion));
        setInitialCurreny(promotion);
      });
    }

    function completeInit(responseCollection) {
      hideLoadingModal();
      var currencyList = angular.copy(responseCollection[0].response);
      var promoList = angular.copy(responseCollection[1].response);
      var dailyExchangeRate = angular.copy(responseCollection[2].dailyExchangeRateCurrencies);
      var verifiedData = angular.copy(responseCollection[3]);
      var cmpPromotionsList = angular.copy(responseCollection[4]);

      $scope.dailyExchangeRates = dailyExchangeRate;

      setCashBagCurrencyList(currencyList);
      setBaseCurrency();

      setVerifiedData(verifiedData);
      setPromotionsList(promoList, cmpPromotionsList);
    }

    function getInitDependencies(storeInstanceDataFromAPI) {
      $scope.storeInstance = angular.copy(storeInstanceDataFromAPI);
      $scope.selectedCurrency = {};
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));
      $scope.companyId = globalMenuService.getCompanyData().companyId;
      var payload = {
        companyId: $scope.companyId,
        startDate: dateUtility.nowFormatted('YYYYMMDD'),
        endDate: dateUtility.nowFormatted('YYYYMMDD')
      };
      var promises = [
        manualEposFactory.getCurrencyList({ startDate: dateForFilter, endDate: dateForFilter, isOperatedCurrency: true }),
        manualEposFactory.getCashBagPromotionList($routeParams.cashbagId),
        manualEposFactory.getDailyExchangeRate($scope.cashBag.dailyExchangeRateId),
        manualEposFactory.checkCashBagVerification($routeParams.cashbagId),
        manualEposFactory.getCompanyPromotionsList(payload)
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
      manualEposFactory.getCashBag($routeParams.cashbagId).then(getStoreInstanceThenContinueInit, showErrors);
    }

    init();

  });
