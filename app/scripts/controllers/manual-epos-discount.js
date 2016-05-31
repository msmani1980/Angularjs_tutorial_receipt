'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposDiscountCtrl
 * @description
 * # ManualEposDiscountCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposDiscountCtrl', function ($scope, $routeParams, $q, manualEposFactory, dateUtility, globalMenuService,
    lodash, messageService, $location) {

    function createNewDiscountObject (dscntTypeName) {
      var newDiscount = {
        cashbagId:$scope.cashBag.id,
        eposCashBagsId:$scope.cashBag.eposCashBagsId,
        storeInstanceId:$scope.cashBag.storeInstanceId,
        discountId:null,
        discount:null,
        id:null,
        currencyId:$scope.selectedCurrency.currency.currencyId,
        currency:$scope.selectedCurrency.currency,
        amount:0.00,
        quantity:0,
        currentCurrencyAmount:0.00,
        baseCurrencyAmount:0.00,
        exchangeRate:$scope.selectedCurrency.currency.exchangeRate,
        discountTypeName: dscntTypeName
      };
      return newDiscount;
    }

    $scope.addCouponDiscount = function() {
      $scope.discountListCoupon.push(angular.copy(createNewDiscountObject('Coupon')));
    };

    $scope.addVoucherDiscount = function() {
      $scope.discountListVoucher.push(angular.copy(createNewDiscountObject('Voucher')));
    };

    $scope.addCompDiscount = function() {
      $scope.discountListComp.push(angular.copy(createNewDiscountObject('Comp')));
    };

    $scope.addFlyerDiscount = function() {
      $scope.discountListFlyer.push(angular.copy(createNewDiscountObject('Frequent Flyer')));
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

    function changeCurrency (discountList) {
      angular.forEach(discountList, function (discount) {
        discount.exchangeRate = $scope.selectedCurrency.currency.exchangeRate;
        discount.currencyId = $scope.selectedCurrency.currency.currencyId;
        discount.baseCurrencyAmount = getBaseCurrencyAmount(discount);
      });
    }

    $scope.onChangeCurrency = function() {
      changeCurrency($scope.discountListCoupon);
      changeCurrency($scope.discountListVoucher);
      changeCurrency($scope.discountListComp);
      changeCurrency($scope.discountListFlyer);
    };

    $scope.onChangeDiscount  = function(manualDiscountObj) {
      manualDiscountObj.discountId = manualDiscountObj.discount.id;
      return manualDiscountObj;
    };

    $scope.onChangePriceOrQty = function (manualDiscountObj) {
      manualDiscountObj.currentCurrencyAmount = getCurrentCurrencyAmount(manualDiscountObj);
      manualDiscountObj.baseCurrencyAmount = getBaseCurrencyAmount(manualDiscountObj);
      return manualDiscountObj;
    };

    function getTotalAmount (discountList) {
      var runningSum = 0;
      angular.forEach(discountList, function (discount) {
        var baseCurrencyAmount = discount.baseCurrencyAmount || 0;
        runningSum += parseFloat(baseCurrencyAmount);
      });

      return runningSum;
    }

    $scope.sumCouponAmounts = function () {
      return parseFloat(getTotalAmount($scope.discountListCoupon)).toFixed(2);
    };

    $scope.sumVoucherAmounts = function () {
      return parseFloat(getTotalAmount($scope.discountListVoucher)).toFixed(2);
    };

    $scope.sumCompAmounts = function () {
      return parseFloat(getTotalAmount($scope.discountListComp)).toFixed(2);
    };

    $scope.sumFlyerAmounts = function () {
      return parseFloat(getTotalAmount($scope.discountListFlyer)).toFixed(2);
    };

    function getCurrentCurrencyAmount (discountObject) {
      var сurrencyAmount = 0.00;
      if (!discountObject.amount || discountObject.amount === null || !discountObject.quantity || discountObject.quantity === null) {
        return сurrencyAmount.toFixed(2);
      }

      сurrencyAmount = discountObject.amount * discountObject.quantity;
      return parseFloat(сurrencyAmount).toFixed(2);
    }

    function calculateBaseCurrencyAmount (discountObject) {
      var baseCurrencyAmount = 0.00;
      if (discountObject.exchangeRate.bankExchangeRate === null) {
        var paperExchangeRate = discountObject.exchangeRate.paperExchangeRate;
        var coinExchangeRate = discountObject.exchangeRate.coinExchangeRate;
        if (!paperExchangeRate && !coinExchangeRate) {
          return baseCurrencyAmount.toFixed(2);
        }

        var splitAmounts = (discountObject.currentCurrencyAmount).split('.');
        var convertedPaperAmount = parseFloat(splitAmounts[0]) / paperExchangeRate;
        var convertedCoinAmount = parseFloat(splitAmounts[1]) / coinExchangeRate;
        baseCurrencyAmount = convertedPaperAmount + (convertedCoinAmount / 100);
      } else {
        var exchangeRate = discountObject.exchangeRate.bankExchangeRate;
        baseCurrencyAmount = (!exchangeRate ? 0.00 : parseFloat(discountObject.currentCurrencyAmount) / exchangeRate);
      }

      return baseCurrencyAmount;
    }

    function getBaseCurrencyAmount (discountObject) {
      var baseCurrencyAmount = 0.00;
      if (!discountObject.currentCurrencyAmount) {
        return baseCurrencyAmount.toFixed(2);
      }

      if ($scope.baseCurrency.currencyId && discountObject.currencyId && $scope.baseCurrency.currencyId === discountObject.currencyId) {
        return discountObject.currentCurrencyAmount;
      } else {
        baseCurrencyAmount = calculateBaseCurrencyAmount(discountObject);
      }

      return baseCurrencyAmount.toFixed(2);
    }

    function setVerifiedInfo (verifiedDataFromAPI) {
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

    function setVerifiedData(verifiedDataFromAPI) {
      $scope.isVerified = (!!verifiedDataFromAPI.discountVerifiedOn) || false;
      $scope.isCashBagConfirmed = (!!verifiedDataFromAPI.verificationConfirmedOn) || false;
      setVerifiedInfo(verifiedDataFromAPI);
    }

    function verifyToggleSuccess(dataFromAPI) {
      setVerifiedData(angular.copy(dataFromAPI));
      hideLoadingModal();
    }

    $scope.verify = function () {
      showLoadingModal('Verifying');
      manualEposFactory.verifyCashBag($routeParams.cashBagId, 'DISCOUNT').then(verifyToggleSuccess, showErrors);
    };

    $scope.unverify = function () {
      showLoadingModal('Unverifying');
      manualEposFactory.unverifyCashBag($routeParams.cashBagId, 'DISCOUNT').then(verifyToggleSuccess, showErrors);
    };

    function updateCashBagDiscount(discount) {
      var payload = {
        id: discount.id,
        cashbagId: discount.cashbagId,
        discountId: discount.discountId,
        currencyId: discount.currencyId,
        amount: discount.amount,
        quantity: discount.quantity,
        convertedAmount: discount.baseCurrencyAmount
      };

      return manualEposFactory.updateCashBagDiscount($routeParams.cashBagId, discount.id, payload);
    }

    function createCashBagDiscount(discount) {
      var payload = {
        cashbagId: discount.cashbagId,
        discountId: discount.discountId,
        currencyId: discount.currencyId,
        amount: discount.amount,
        quantity: discount.quantity,
        convertedAmount: discount.baseCurrencyAmount
      };

      return manualEposFactory.createCashBagDiscount($routeParams.cashBagId, payload);
    }

    function saveSuccess() {
      hideLoadingModal();
      if ($scope.shouldExit) {
        $location.path('manual-epos-dashboard/' + $routeParams.cashBagId);
      }

      messageService.success('Manual discount data successfully saved!');
    }

    function addToPromises (discountList, promises) {
      angular.forEach(discountList, function (discount) {
        if (discount.id) {
          promises.push(updateCashBagDiscount(discount));
        } else {
          promises.push(createCashBagDiscount(discount));
        }
      });
    }

    $scope.save = function () {
      showLoadingModal('Saving');
      var promises = [];
      addToPromises($scope.discountListCoupon, promises);
      addToPromises($scope.discountListVoucher, promises);
      addToPromises($scope.discountListComp, promises);
      addToPromises($scope.discountListFlyer, promises);
      $q.all(promises).then(saveSuccess, showErrors);
    };

    $scope.setShouldExit = function (shouldExit) {
      $scope.shouldExit = shouldExit;
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

    function setDiscountsList(allDiscountsTypeList) {
      $scope.discountListCoupon = [];
      $scope.discountListVoucher = [];
      $scope.discountListComp = [];
      $scope.discountListFlyer = [];
      angular.forEach(allDiscountsTypeList, function (discount) {
        var voucherListMatch = lodash.findWhere($scope.companyDiscountsList.voucher, { id: discount.discountId });
        var couponListMatch = lodash.findWhere($scope.companyDiscountsList.coupon, { id: discount.discountId });
        var compListMatch = lodash.findWhere($scope.companyDiscountsList.comp, { id: discount.discountId });
        var flyerListMatch = lodash.findWhere($scope.companyDiscountsList.flyer, { id: discount.discountId });

        if (voucherListMatch) {
          addDiscountToList(discount, $scope.companyDiscountsList.voucher, $scope.discountListVoucher);
        } else if (couponListMatch) {
          addDiscountToList(discount, $scope.companyDiscountsList.coupon, $scope.discountListCoupon);
        } else if (compListMatch) {
          addDiscountToList(discount, $scope.companyDiscountsList.comp, $scope.discountListComp);
        } else if (flyerListMatch) {
          addDiscountToList(discount, $scope.companyDiscountsList.flyer, $scope.discountListFlyer);
        }

        setInitialCurreny(discount);
      });
    }

    function addDiscountToList (discountObject, discountDropDown, discountList) {
      discountObject.exchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: discountObject.currencyId }) || {};
      discountObject.currentCurrencyAmount = getCurrentCurrencyAmount(discountObject);
      discountObject.baseCurrencyAmount = getBaseCurrencyAmount(discountObject);
      discountObject.discount = lodash.findWhere(discountDropDown, { id: discountObject.discountId }) || {};
      discountObject.discountTypeName = (discountObject.discount.discountTypeName && discountObject.discount.discountTypeName !== null ? discountObject.discount.discountTypeName : '');
      discountList.push(angular.copy(discountObject));
    }

    function completeInit(responseCollection) {
      hideLoadingModal();
      var currencyList = angular.copy(responseCollection[0].response);
      var allDiscountsTypeList = angular.copy(responseCollection[1].response);
      var dailyExchangeRate = angular.copy(responseCollection[2].dailyExchangeRateCurrencies);
      var voucherList = angular.copy(responseCollection[3].companyDiscounts);
      var couponList = angular.copy(responseCollection[4].companyDiscounts);
      var compList = angular.copy(responseCollection[5].companyDiscounts);
      var flyerList = angular.copy(responseCollection[6].companyDiscounts);
      var verifiedData = angular.copy(responseCollection[7]);

      $scope.dailyExchangeRates =  dailyExchangeRate;
      $scope.cashBagDiscountsList = allDiscountsTypeList;
      $scope.companyDiscountsList = {
        voucher: voucherList,
        coupon: couponList,
        comp: compList,
        flyer: flyerList
      };

      setCashBagCurrencyList(currencyList);
      setBaseCurrency();
      setVerifiedData(verifiedData);
      setDiscountsList(allDiscountsTypeList);
    }

    function getInitDependencies(storeInstanceDataFromAPI) {
      $scope.storeInstance = angular.copy(storeInstanceDataFromAPI);
      $scope.selectedCurrency = {};
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));
      var payload = {
        isActive: true,
        startDate: dateUtility.nowFormatted('YYYYMMDD'),
        endDate: dateUtility.nowFormatted('YYYYMMDD')
      };

      var promises = [
        manualEposFactory.getCurrencyList({ startDate: dateForFilter, endDate: dateForFilter,  isOperatedCurrency: true }),
        manualEposFactory.getCashBagDiscountList($routeParams.cashBagId, {}),
        manualEposFactory.getDailyExchangeRate($scope.cashBag.dailyExchangeRateId),
        manualEposFactory.getCompanyDiscountsVoucher(payload),
        manualEposFactory.getCompanyDiscountsCoupon(payload),
        manualEposFactory.getCompanyDiscountsComp(payload),
        manualEposFactory.getCompanyDiscountsFrequentFlyer(payload),
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
