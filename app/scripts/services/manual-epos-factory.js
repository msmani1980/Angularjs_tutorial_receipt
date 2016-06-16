'use strict';

/**
 * @ngdoc service
 * @name ts5App.manualEposFactory
 * @description
 * # manualEposFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('manualEposFactory', function ($q, cashBagService, currenciesService, globalMenuService,
    dailyExchangeRatesService, storeInstanceService, itemsService, recordsService,
    companyDiscountService, promotionsService) {

    var getPromotionsList = function () {
      var mockPromotionsList = [{
        benefitTypeId: 1,
        benefitTypeName: 'Discount',
        catalogCount: 2,
        companyId: 403,
        id: 117,
        description: 'Buy 4 drinks get 20% off',
        discountTypeId: 1,
        discountTypeName: 'Percentage',
        endDate: '2015-09-19',
        startDate: '2015-01-01',
        promotionCode: 'PM001',
        promotionName: 'Buy 4 drinks get 20 percent off',
        promotionTypeId: 1,
        promotionTypeName: ' Product Purchase',
        quantity: 2,
        price: 10.11,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        benefitTypeId: 1,
        benefitTypeName: ' Discount',
        catalogCount: 7,
        companyId: 403,
        id: 118,
        description: 'Buy 2 items get 10 percent off',
        discountTypeId: 1,
        discountTypeName: 'Percentage',
        endDate: '2018-12-31',
        startDate: '2015-01-01',
        promotionCode: 'PM002',
        promotionName: 'Buy 2 items get 10 percent off',
        promotionTypeId: 1,
        promotionTypeName: 'Product Purchase',
        quantity: 2,
        price: 10.11,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        benefitTypeId: 1,
        benefitTypeName: ' Discount',
        catalogCount: 0,
        companyId: 403,
        id: 119,
        description: 'randomdata',
        discountTypeId: 1,
        discountTypeName: 'Percentage',
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        promotionCode: ' TEXT',
        promotionName: 'randomdata',
        promotionTypeId: 1,
        promotionTypeName: 'Product Purchase',
        quantity: 2,
        price: 10.11,
        currencyValue: 20.00,
        audValue: 23.75
      }];

      var getPromotionsListDeferred = $q.defer();
      getPromotionsListDeferred.resolve(mockPromotionsList);
      return getPromotionsListDeferred.promise;
    };

    var getDiscountsList = function () {
      var mockDiscountsList = {
        voucher: [{
          endDate: '2015-05-29',
          startDate: '2015-01-01',
          discountCode: ' V10',
          discountName: '10 Off Vocucher',
          discountTypeId: 1,
          quantity: 2,
          price: 10.00,
          currencyValue: 20.00,
          audValue: 23.75
        }, {
          endDate: '2015-05-29',
          startDate: '2015-01-01',
          discountCode: ' V30',
          discountName: '30 Off Vocucher',
          discountTypeId: 1,
          quantity: 2,
          price: 5.00,
          currencyValue: 50.00,
          audValue: 57.25
        }, {
          endDate: '2015-05-29',
          startDate: '2015-01-01',
          discountCode: 'IV1',
          discountName: 'Item Voucher 1',
          discountTypeId: 1,
          quantity: null,
          price: null,
          currencyValue: null,
          audValue: null
        }],
        coupon: [{
          endDate: '2015-05-29',
          startDate: '2015-01-01',
          discountCode: ' V10',
          discountName: '10 Off Coupon',
          discountTypeId: 1,
          quantity: 2,
          price: 10.00,
          currencyValue: 20.00,
          audValue: 23.75
        }, {
          endDate: '2015-05-29',
          startDate: '2015-01-01',
          discountCode: ' V30',
          discountName: '30 Off Coupon',
          discountTypeId: 1,
          quantity: 2,
          price: 5.00,
          currencyValue: 50.00,
          audValue: 57.25
        }, {
          endDate: '2015-05-29',
          startDate: '2015-01-01',
          discountCode: 'IV1',
          discountName: 'Item Coupon 1',
          discountTypeId: 1,
          quantity: null,
          price: null,
          currencyValue: null,
          audValue: null
        }]
      };

      var getDiscountsListDeferred = $q.defer();
      getDiscountsListDeferred.resolve(mockDiscountsList);
      return getDiscountsListDeferred.promise;
    };

    function getCurrencyList(payload) {
      payload = payload || {};
      return currenciesService.getCompanyCurrencies(payload);
    }

    function getDailyExchangeRate(exchangeRateId) {
      var companyId = globalMenuService.getCompanyData().companyId;
      return dailyExchangeRatesService.getDailyExchangeById(companyId, exchangeRateId);
    }

    function getCashBag(cashBagId) {
      return cashBagService.getCashBag(cashBagId);
    }

    function getAllManualCashList(payload) {
      return cashBagService.getAllManualCashList(payload);
    }

    function getCashBagCashList(cashBagId, payload) {
      var payloadForRequest = payload || {};
      return cashBagService.getManualCashBagCashList(cashBagId, payloadForRequest);
    }

    function createCashBagCash(cashBagId, payload) {
      var payloadForRequest = payload || {};
      cashBagService.createManualCashBagCashRecord(cashBagId, payloadForRequest);
    }

    function updateCashBagCash(cashBagId, cashId, payload) {
      var payloadForRequest = payload || {};
      cashBagService.updateManualCashBagCashRecord(cashBagId, cashId, payloadForRequest);
    }

    function getCashBagCreditList(cashBagId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      return cashBagService.getManualCashBagList('credit-cards', payloadForRequest);
    }

    function createCashBagCredit(cashBagId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      cashBagService.createManualCashBagRecord('credit-cards', payloadForRequest);
    }

    function updateCashBagCredit(cashBagId, creditId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      cashBagService.updateManualCashBagRecord('credit-cards', creditId, payloadForRequest);
    }

    function getCashBagItemList(cashBagId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      return cashBagService.getManualCashBagList('items', payloadForRequest);
    }

    function createCashBagItem(cashBagId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      cashBagService.createManualCashBagRecord('items', payloadForRequest);
    }

    function updateCashBagItem(cashBagId, itemId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      cashBagService.updateManualCashBagRecord('items', itemId, payloadForRequest);
    }

    function getStoreInstance(storeInstanceId) {
      return storeInstanceService.getStoreInstance(storeInstanceId);
    }

    function verifyCashBag(cashBagId, verifyType) {
      return cashBagService.verifyCashBag(cashBagId, verifyType);
    }

    function unverifyCashBag(cashBagId, verifyType) {
      return cashBagService.unverifyCashBag(cashBagId, verifyType);
    }

    function checkCashBagVerification(cashBagId) {
      var payload = { id: cashBagId };
      return cashBagService.getCashBagVerifications(payload);
    }

    function getRetailItems(payload) {
      return itemsService.getItemsList(payload, true);
    }

    function getItemTypes() {
      return recordsService.getItemTypes();
    }

    function getCashBagDiscountList(cashBagId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      return cashBagService.getManualCashBagList('discounts', payloadForRequest);
    }

    function createCashBagDiscount(cashBagId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      cashBagService.createManualCashBagRecord('discounts', payloadForRequest);
    }

    function updateCashBagDiscount(cashBagId, discountId, payload) {
      var payloadForRequest = payload || {};
      payloadForRequest.cashbagId = cashBagId;
      cashBagService.updateManualCashBagRecord('discounts', discountId, payloadForRequest);
    }

    function getCompanyDiscountsCoupon(datesPayload) {
      var payload = angular.extend({
        discountTypeId: 1
      }, datesPayload);
      return companyDiscountService.getDiscountList(payload);
    }

    function getCompanyDiscountsVoucher(datesPayload) {
      var payload = angular.extend({
        discountTypeId: 4
      }, datesPayload);
      return companyDiscountService.getDiscountList(payload);
    }

    function getCompanyDiscountsComp(datesPayload) {
      var payload = angular.extend({
        discountTypeId: 2
      }, datesPayload);
      return companyDiscountService.getDiscountList(payload);
    }

    function getCompanyDiscountsFrequentFlyer(datesPayload) {
      var payload = angular.extend({
        discountTypeId: 3
      }, datesPayload);
      return companyDiscountService.getDiscountList(payload);
    }

    function getCashBagPromotionList(cashBagId) {
      var payload = { cashbagId: cashBagId };
      return cashBagService.getManualCashBagList('promotions', payload);
    }

    function updateManualEposPromotion(cashBagId, promotionId, payload) {
      return cashBagService.updateManualCashBagRecord('promotions', cashBagId, promotionId, payload);
    }

    function createManualEposPromotion(cashBagId, payload) {
      return cashBagService.createManualCashBagRecord('promotions', cashBagId, payload);
    }

    function getCompanyPromotionsList(payload) {
      return promotionsService.getPromotions(payload);
    }

    return {
      getPromotionsList: getPromotionsList,
      getCurrencyList: getCurrencyList,
      getDiscountsList: getDiscountsList,
      getCashBag: getCashBag,
      getDailyExchangeRate: getDailyExchangeRate,
      getStoreInstance: getStoreInstance,
      verifyCashBag: verifyCashBag,
      unverifyCashBag: unverifyCashBag,
      checkCashBagVerification: checkCashBagVerification,
      getAllManualCashList: getAllManualCashList,
      getCashBagCashList: getCashBagCashList,
      createCashBagCash: createCashBagCash,
      updateCashBagCash: updateCashBagCash,
      getCashBagCreditList: getCashBagCreditList,
      createCashBagCredit: createCashBagCredit,
      updateCashBagCredit: updateCashBagCredit,
      getCashBagItemList: getCashBagItemList,
      createCashBagItem: createCashBagItem,
      updateCashBagItem: updateCashBagItem,
      getRetailItems: getRetailItems,
      getItemTypes: getItemTypes,
      getCashBagDiscountList: getCashBagDiscountList,
      createCashBagDiscount: createCashBagDiscount,
      updateCashBagDiscount: updateCashBagDiscount,
      getCompanyDiscountsCoupon: getCompanyDiscountsCoupon,
      getCompanyDiscountsVoucher: getCompanyDiscountsVoucher,
      getCompanyDiscountsComp:getCompanyDiscountsComp,
      getCompanyDiscountsFrequentFlyer:getCompanyDiscountsFrequentFlyer,
      createManualEposPromotion: createManualEposPromotion,
      updateManualEposPromotion: updateManualEposPromotion,
      getCashBagPromotionList: getCashBagPromotionList,
      getCompanyPromotionsList:getCompanyPromotionsList
    };

  });
