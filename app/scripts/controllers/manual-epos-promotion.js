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
                                                   lodash, messageService, $location, $filter) {
    $scope.addPromotion = function () {
      if (canAddPromotion()) {
        $scope.promotionList.push(angular.copy(createNewPromotionObject()));
      }
    };

    function createNewPromotionObject () {
      var newPromotion = {
        cashbagId: $scope.cashBag.id,
        eposCashBagsId: $scope.cashBag.eposCashBagsId,
        storeInstanceId: $scope.cashBag.storeInstanceId,
        promotionId: null,
        promotion: null,
        id: null,
        currencyId: $scope.baseCurrency.currencyId,
        currency: $scope.baseCurrency.currency,
        amount: 0.00,
        quantity: 0,
        currentCurrencyAmount: 0.00,
        baseCurrencyAmount: 0.00,
        exchangeRate: $scope.baseCurrency.currency.exchangeRate,
        companyId: $scope.companyId,
        promotionName:''
      };

      return newPromotion;
    }

    function canAddPromotion () {
      var canAddPromo = false;
      if ($scope.companyPromotionList.promotions.length > 0) {
        canAddPromo = true;
        for (var i = $scope.promotionList.length - 1; i >= 0; i--) {
          if ($scope.promotionList[i].promotionId === null) {
            canAddPromo = false;
            break;
          }
        }
      }

      return canAddPromo;
    }

    function saveSuccess(dataFromApi) {
      var updatedList = [];
      angular.forEach($scope.promotionList, function (promotion) {
        if (promotion.id === null) {
          var createdPromo = lodash.filter(dataFromApi, { promotionId: promotion.promotionId });
          if (createdPromo !== null && createdPromo.length) {
            promotion.id = createdPromo[0].id;
          }
        }

        updatedList.push(promotion);
      });

      $scope.promotionList = updatedList;
      hideLoadingModal();
      if ($scope.shouldExit) {
        $location.path('manual-epos-dashboard/' + $routeParams.cashbagId);
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
      return manualEposFactory.updateManualEposPromotion($routeParams.cashbagId, promotion.id, payload);
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
      return manualEposFactory.createManualEposPromotion($routeParams.cashbagId, payload);
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
      if ($scope.shouldVerify) {
        $q.all(promises).then(saveSuccessVerify, showErrors);
      } else {
        $q.all(promises).then(saveSuccess, showErrors);
      }
    };

    $scope.setShouldExit = function (shouldExit, shouldVerify) {
      $scope.shouldExit = shouldExit;
      $scope.shouldVerify = shouldVerify;
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
      $scope.shouldExit = false;
      var promises = [];
      addToPromises($scope.promotionList, promises);
      $q.all(promises).then(saveSuccessVerify, showErrors);
    };

    function saveSuccessVerify() {
      manualEposFactory.verifyCashBag($scope.cashBag.id, 'PROMO').then(verifyToggleSuccess, showErrors);
    }

    $scope.unverify = function () {
      showLoadingModal('Unverifying');
      manualEposFactory.unverifyCashBag($scope.cashBag.id, 'PROMO').then(verifyToggleSuccess, showErrors);
    };

    function setBaseCurrency() {
      $scope.baseCurrency = {};
      $scope.baseCurrency.currencyId = globalMenuService.getCompanyData().baseCurrencyId;
      $scope.baseCurrency.currency = lodash.findWhere($scope.currencyList, { currencyId: $scope.baseCurrency.currencyId });
      
      $scope.selectedCurrency.currency = $scope.baseCurrency.currency;
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

    function setInitialCurreny() {
      $scope.selectedCurrency.currency = $scope.baseCurrency.currency;
    }

    $scope.isSaveVerify = function () {
      var isDisable = true;
      if (angular.isDefined($scope.promotionList) && $scope.promotionList.length > 0) {
        for (var i = $scope.promotionList.length - 1; i >= 0; i--) {
          isDisable = false;
          if ($scope.promotionList[i].promotionId === null) {
            isDisable = true;
            break;
          }
        }
      } 

      return isDisable;
    };

    $scope.onChangePromotion = function (promotionObj) {
      promotionObj.promotionId = promotionObj.companyPromotion.id;
      promotionObj.promotionName = (promotionObj.companyPromotion.promotionName && promotionObj.companyPromotion.promotionName !== null ? promotionObj.companyPromotion.promotionName : '');
      updateCompanyPromotionList(); 

      return promotionObj;
    };
    
    function updateCompanyPromotionList () {
      $scope.companyPromotionList = angular.copy($scope.allPromotionList);
      for (var i = $scope.promotionList.length - 1; i >= 0; i--) {
        for (var j = $scope.companyPromotionList.promotions.length - 1; j >= 0; j--) {
          if ($scope.promotionList[i].promotionId === $scope.companyPromotionList.promotions[j].id) {
            $scope.companyPromotionList.promotions.splice(j, 1);
          }
        }
      }
    }

    function getBaseCurrencyAmount(promotionObject) {
      var baseCurrencyAmount = 0.00;
      if (!promotionObject.currentCurrencyAmount) {
        return baseCurrencyAmount.toFixed(2);
      }

      return promotionObject.currentCurrencyAmount;
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

      $scope.allPromotionList = angular.copy($scope.companyPromotionList);
      $scope.promotionList = $filter('orderBy')($scope.promotionList, 'promotionName', false);
      var cmpPr = $filter('orderBy')($scope.allPromotionList.promotions, 'promotionName', false);
      $scope.allPromotionList.promotions = cmpPr; 
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
      updateCompanyPromotionList();
    }

    function getInitDependencies(storeInstanceDataFromAPI) {
      $scope.storeInstance = angular.copy(storeInstanceDataFromAPI);
      $scope.selectedCurrency = {};
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));

      $scope.companyId = globalMenuService.getCompanyData().companyId;
      var payload = {
        companyId: $scope.companyId,
        startDate: dateForFilter,
        endDate: dateForFilter
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
