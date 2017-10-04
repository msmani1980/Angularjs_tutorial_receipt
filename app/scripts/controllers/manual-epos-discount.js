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

    function createNewDiscountObject () {
      var newDiscount = {
        cashbagId:$scope.cashBag.id,
        eposCashBagsId:$scope.cashBag.eposCashBagsId,
        storeInstanceId:$scope.cashBag.storeInstanceId,
        discountId:null,
        discount:null,
        id:null,
        currencyId:$scope.baseCurrency.currency.currencyId,
        currency:$scope.baseCurrency.currency,
        amount:0.00,
        quantity:0,
        currentCurrencyAmount:0.00,
        baseCurrencyAmount:0.00,
        exchangeRate:$scope.baseCurrency.currency.exchangeRate,
        discountTypeName: ''
      };
      return newDiscount;
    }

    $scope.isSaveVerifyDisable = function () {
      if (isNotDefinedDiscounts() || isNotSetDiscounts()) {
        return true;
      } 

      return false;
    };

    function isNotDefinedDiscounts () {
      if (!angular.isDefined($scope.discountListCoupon) || !angular.isDefined($scope.discountListVoucher) || !angular.isDefined($scope.discountListComp) || !angular.isDefined($scope.discountListFlyer)) {
        return true;
      }

      return false;
    }

    function isNotSetDiscounts () {
      if (isNoCoupon() || isNoComp() || isNoVoucher() || isNoFlyer()) {
        return true;
      } 

      return false;
    }

    function isNoCoupon () {
      for (var i = $scope.discountListCoupon.length - 1; i >= 0; i--) {
        if ($scope.discountListCoupon[i].discount === null) {
          return true;
        }
      }

      return false;
    }

    function isNoComp () {
      for (var i = $scope.discountListComp.length - 1; i >= 0; i--) {
        if ($scope.discountListComp[i].discount === null) {
          return true;
        }
      }

      return false;
    }

    function isNoVoucher () {
      for (var i = $scope.discountListVoucher.length - 1; i >= 0; i--) {
        if ($scope.discountListVoucher[i].discount === null) {
          return true;
        }
      }

      return false;
    }

    function isNoFlyer () {
      for (var i = $scope.discountListFlyer.length - 1; i >= 0; i--) {
        if ($scope.discountListFlyer[i].discount === null) {
          return true;
        }
      }

      return false;
    }

    $scope.addCouponDiscount = function() {
      if ($scope.companyDiscountsList.coupon.length > 0) {
        var canAddDiscount = true;
        for (var i = $scope.discountListCoupon.length - 1; i >= 0; i--) {
          if ($scope.discountListCoupon[i].discount === null) {
            canAddDiscount = false;
            break;
          }
        }

        if (canAddDiscount) {
          $scope.discountListCoupon.push(angular.copy(createNewDiscountObject()));
        }
      }
    };

    $scope.addVoucherDiscount = function() {
      if ($scope.companyDiscountsList.voucher.length > 0) { 
        var canAddDiscount = true;
        for (var i = $scope.discountListVoucher.length - 1; i >= 0; i--) {
          if ($scope.discountListVoucher[i].discount === null) {
            canAddDiscount = false;
            break;
          }
        }

        if (canAddDiscount) {
          $scope.discountListVoucher.push(angular.copy(createNewDiscountObject()));
        }  
      }
    };

    $scope.addCompDiscount = function() {
      if ($scope.companyDiscountsList.comp.length > 0) {
        var canAddDiscount = true;
        for (var i = $scope.discountListComp.length - 1; i >= 0; i--) {
          if ($scope.discountListComp[i].discount === null) {
            canAddDiscount = false;
            break;
          }
        }

        if (canAddDiscount) {
          $scope.discountListComp.push(angular.copy(createNewDiscountObject()));
        }  
      }
    };

    $scope.addFlyerDiscount = function() {
      if ($scope.companyDiscountsList.flyer.length > 0) {  
        var canAddDiscount = true;
        for (var i = $scope.discountListFlyer.length - 1; i >= 0; i--) {
          if ($scope.discountListFlyer[i].discount === null) {
            canAddDiscount = false;
            break;
          }
        }

        if (canAddDiscount) {
          $scope.discountListFlyer.push(angular.copy(createNewDiscountObject('Frequent Flyer')));
        }
      }
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
      manualDiscountObj.discountTypeName = manualDiscountObj.discount.name; 
      manualDiscountObj.discountId = manualDiscountObj.discount.id;
      if (manualDiscountObj.discount.discountTypeId === 1 /*Coupon*/) {
        updateCouponList();
      }

      if (manualDiscountObj.discount.discountTypeId === 2 /*"Comp"*/) {
        updateCompList();
      }

      if (manualDiscountObj.discount.discountTypeId === 3 /*"Frequent Flyer"*/) {
        updateFrequentFlyerList();
      }

      if (manualDiscountObj.discount.discountTypeId === 4 /*"Voucher"*/) {
        updateVoucherList();
      }

      return manualDiscountObj;
    };

    function isCouponDefined () {
      if (angular.isDefined($scope.discountListCoupon) && angular.isDefined($scope.discountListCoupon.length) && angular.isDefined($scope.companyDiscountsList) && angular.isDefined($scope.companyDiscountsList.coupon)  && angular.isDefined($scope.companyDiscountsList.coupon.length)) {
        return true;
      }

      return false;
    }

    function couponList () {
      for (var i = $scope.discountListCoupon.length - 1; i >= 0; i--) {
        for (var j = $scope.companyDiscountsList.coupon.length - 1; j >= 0; j--) {
          if ($scope.discountListCoupon[i].discountId === $scope.companyDiscountsList.coupon[j].id) {
            $scope.companyDiscountsList.coupon.splice(j, 1);
          }
        }
      }
    } 

    function updateCouponList () {
      $scope.companyDiscountsList.coupon = angular.copy($scope.allCouponList);
      if (isCouponDefined()) {
        if (angular.isDefined($scope.discountListCoupon) && angular.isDefined($scope.discountListCoupon.length)) {
          couponList();
        }
      }  
    }

    function isCompDefined () {
      if (angular.isDefined($scope.discountListComp) && angular.isDefined($scope.discountListComp.length) && angular.isDefined($scope.companyDiscountsList) && angular.isDefined($scope.companyDiscountsList.comp)  && angular.isDefined($scope.companyDiscountsList.comp.length)) {
        return true;
      }

      return false;
    }

    function compList () {
      for (var i = $scope.discountListComp.length - 1; i >= 0; i--) {
        for (var j = $scope.companyDiscountsList.comp.length - 1; j >= 0; j--) {
          if ($scope.discountListComp[i].discountId === $scope.companyDiscountsList.comp[j].id) {
            $scope.companyDiscountsList.comp.splice(j, 1);
          }
        }
      }
    } 

    function updateCompList () {
      $scope.companyDiscountsList.comp = angular.copy($scope.allCompList);
      if (isCompDefined()) {
        if (angular.isDefined($scope.discountListComp) && angular.isDefined($scope.discountListComp.length)) {
          compList();
        }
      }  
    }

    function isFlyerDefined () {
      if (angular.isDefined($scope.discountListFlyer) && angular.isDefined($scope.discountListFlyer.length) && angular.isDefined($scope.companyDiscountsList) && angular.isDefined($scope.companyDiscountsList.flyer)  && angular.isDefined($scope.companyDiscountsList.flyer.length)) {
        return true;
      }

      return false;
    }

    function flyerList () {
      for (var i = $scope.discountListFlyer.length - 1; i >= 0; i--) {
        for (var j = $scope.companyDiscountsList.flyer.length - 1; j >= 0; j--) {
          if ($scope.discountListFlyer[i].discountId === $scope.companyDiscountsList.flyer[j].id) {
            $scope.companyDiscountsList.flyer.splice(j, 1);
          }
        }
      }
    }

    function updateFrequentFlyerList () {
      $scope.companyDiscountsList.flyer = angular.copy($scope.allFlyerList);
      if (isFlyerDefined()) {
        if (angular.isDefined($scope.discountListFlyer) && angular.isDefined($scope.discountListFlyer.length)) {
          flyerList();
        }
      }  
    }

    function isVoucherDefined () {
      if (angular.isDefined($scope.discountListVoucher) && angular.isDefined($scope.discountListVoucher.length) && angular.isDefined($scope.companyDiscountsList) && angular.isDefined($scope.companyDiscountsList.voucher)  && angular.isDefined($scope.companyDiscountsList.voucher.length)) {
        return true;
      }

      return false;
    }

    function voucherList () {
      for (var i = $scope.discountListVoucher.length - 1; i >= 0; i--) {
        for (var j = $scope.companyDiscountsList.voucher.length - 1; j >= 0; j--) {
          if ($scope.discountListVoucher[i].discountId === $scope.companyDiscountsList.voucher[j].id) {
            $scope.companyDiscountsList.voucher.splice(j, 1);
          }
        }
      }
    }

    function updateVoucherList () {
      $scope.companyDiscountsList.voucher = angular.copy($scope.allVoucherList);
      if (isVoucherDefined()) {
        voucherList();
      }
    }

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

    function getBaseCurrencyAmount (discountObject) {
      var baseCurrencyAmount = 0.00;
      if (!discountObject.currentCurrencyAmount) {
        return baseCurrencyAmount.toFixed(2);
      }

      return discountObject.currentCurrencyAmount;
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

    function verifySuccess() {
      manualEposFactory.verifyCashBag($routeParams.cashBagId, 'DISCOUNT').then(verifyToggleSuccess, showErrors);
    }

    $scope.verify = function () {
      showLoadingModal('Verifying');
      var promises = [];
      addToPromises($scope.discountListComp, promises);
      addToPromises($scope.discountListCoupon, promises);
      addToPromises($scope.discountListVoucher, promises);
      addToPromises($scope.discountListFlyer, promises);
      $q.all(promises).then(verifySuccess, showErrors);
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
      if ($scope.shouldVerify) {
        $q.all(promises).then(verifySuccess, showErrors);
      } else {
        $q.all(promises).then(saveSuccess, showErrors);
      }
    };

    $scope.setShouldExit = function (shouldExit, shouldVerify) {
      $scope.shouldExit = shouldExit;
      $scope.shouldVerify = shouldVerify;
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

    function setInitialCurreny () {
      if (!$scope.baseCurrency || !$scope.baseCurrency.currency) {
        setBaseCurrency();
      }

      $scope.selectedCurrency = angular.copy($scope.baseCurrency); 
    }

    function setDiscountsList(allDiscountsTypeList) {
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

        setInitialCurreny();
      });
    }

    function addDiscountToList (discountObject, discountDropDown, discountList) {
      discountObject.exchangeRate = lodash.findWhere($scope.dailyExchangeRates, { retailCompanyCurrencyId: discountObject.currencyId }) || {};
      discountObject.currentCurrencyAmount = getCurrentCurrencyAmount(discountObject);
      discountObject.baseCurrencyAmount = getBaseCurrencyAmount(discountObject);
      discountObject.discount = lodash.findWhere(discountDropDown, { id: discountObject.discountId }) || {};
      discountObject.discountTypeName = (discountObject.discount.name && discountObject.discount.name !== null ? discountObject.discount.name : '');
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

      $scope.allVoucherList = angular.copy(voucherList);
      $scope.allCouponList = angular.copy(couponList);
      $scope.allCompList = angular.copy(compList);
      $scope.allFlyerList = angular.copy(flyerList);

      setCashBagCurrencyList(currencyList);
      setBaseCurrency();
      setVerifiedData(verifiedData);
      setDiscountsList(allDiscountsTypeList);
      updateCouponList();
      updateCompList();
      updateFrequentFlyerList();
      updateVoucherList();
    }

    function getInitDependencies(storeInstanceDataFromAPI) {
      $scope.discountListCoupon = [];
      $scope.discountListVoucher = [];
      $scope.discountListComp = [];
      $scope.discountListFlyer = [];
      $scope.storeInstance = angular.copy(storeInstanceDataFromAPI);
      $scope.selectedCurrency = {};
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));
      var payload = {
        startDate: dateForFilter,
        endDate: dateForFilter
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
