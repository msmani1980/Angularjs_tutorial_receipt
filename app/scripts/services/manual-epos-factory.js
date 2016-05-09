'use strict';

/**
 * @ngdoc service
 * @name ts5App.manualEposFactory
 * @description
 * # manualEposFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('manualEposFactory', function ($q, cashBagService, currenciesService, globalMenuService, dailyExchangeRatesService, storeInstanceService) {

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

    var getVoucherItemsList = function () {
      var mockVoucherItemsList = [{
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        voucherCode: ' V10',
        voucherName: '10 Off Vocucher',
        voucherTypeId: 1,
        quantity: 2,
        price: 10.00,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        voucherCode: ' V30',
        voucherName: '30 Off Vocucher',
        voucherTypeId: 1,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        voucherCode: 'IV1',
        voucherName: 'Item Voucher 1',
        voucherTypeId: 1,
        quantity: null,
        price: null,
        currencyValue: null,
        audValue: null
      }];

      var getVoucherItemsListDeferred = $q.defer();
      getVoucherItemsListDeferred.resolve(mockVoucherItemsList);
      return getVoucherItemsListDeferred.promise;
    };

    var getVirtualItemsList = function () {
      var mockVirtualItemsList = [{
        companyId: 403,
        itemCode: 'Mov230',
        itemName: 'Movie Ticket',
        itemTypeName: 'Virtual',
        itemTypeId: 2,
        categoryName: 'Virtual Items',
        salesCategoryId: 231,
        sellingPoint: 'Virtual',
        stockOwnerCode: null,
        onBoardName: ' Movie Ticket',
        currentPrice: null,
        description: 'Movie Ticket',
        imageUrl: ' https://s3.amazonaws.com/ts5-qa-portal-images/item-511b8541-418d-4600-9339-de993d1a82e4.png',
        startDate: '2015-06-01',
        endDate: '2018-12-31',
        keywords: 'Movie',
        isPrintReceipt: true,
        id: 405,
        itemMasterId: 38,
        subViewItems: null,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        companyId: 403,
        itemCode: 'Mov230',
        itemName: 'Video',
        itemTypeName: 'Virtual',
        itemTypeId: 2,
        categoryName: 'Virtual Items',
        salesCategoryId: 231,
        sellingPoint: 'Virtual',
        stockOwnerCode: null,
        onBoardName: ' Movie Ticket',
        currentPrice: null,
        description: 'Movie Ticket',
        imageUrl: ' https://s3.amazonaws.com/ts5-qa-portal-images/item-511b8541-418d-4600-9339-de993d1a82e4.png',
        startDate: '2015-06-01',
        endDate: '2018-12-31',
        keywords: 'Movie',
        isPrintReceipt: true,
        id: 405,
        itemMasterId: 38,
        subViewItems: null,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        companyId: 403,
        itemCode: 'Mov230',
        itemName: 'Video Game',
        itemTypeName: 'Virtual',
        itemTypeId: 2,
        categoryName: 'Virtual Items',
        salesCategoryId: 231,
        sellingPoint: 'Virtual',
        stockOwnerCode: null,
        onBoardName: ' Movie Ticket',
        currentPrice: null,
        description: 'Movie Ticket',
        imageUrl: ' https://s3.amazonaws.com/ts5-qa-portal-images/item-511b8541-418d-4600-9339-de993d1a82e4.png',
        startDate: '2015-06-01',
        endDate: '2018-12-31',
        keywords: 'Movie',
        isPrintReceipt: true,
        id: 405,
        itemMasterId: 38,
        subViewItems: null,
        quantity: null,
        price: null,
        currencyValue: null,
        audValue: null
      }];

      var getVirtualItemsListDeferred = $q.defer();
      getVirtualItemsListDeferred.resolve(mockVirtualItemsList);
      return getVirtualItemsListDeferred.promise;
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

    function getCashBagCashList(cashBagId, payload) {
      return cashBagService.getManualCashBagList('cash', cashBagId, payload);
    }

    function createCashBagCash(cashBagId, payload) {
      cashBagService.createManualCashBagRecord('cash', cashBagId, payload);
    }

    function updateCashBagCash(cashBagId, cashId, payload) {
      cashBagService.updateManualCashBagRecord('cash', cashBagId, cashId, payload);
    }

    function getCashBagCreditList(cashBagId, payload) {
      return cashBagService.getManualCashBagList('credit', cashBagId, payload);
    }

    function createCashBagCredit(cashBagId, payload) {
      cashBagService.createManualCashBagRecord('credit', cashBagId, payload);
    }

    function updateCashBagCredit(cashBagId, creditId, payload) {
      cashBagService.updateManualCashBagRecord('credit', cashBagId, creditId, payload);
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

    return {
      getPromotionsList: getPromotionsList,
      getCurrencyList: getCurrencyList,
      getVoucherItemsList: getVoucherItemsList,
      getVirtualItemsList: getVirtualItemsList,
      getDiscountsList: getDiscountsList,
      getCashBag: getCashBag,
      getDailyExchangeRate: getDailyExchangeRate,
      getStoreInstance: getStoreInstance,
      verifyCashBag: verifyCashBag,
      unverifyCashBag: unverifyCashBag,
      checkCashBagVerification: checkCashBagVerification,
      getCashBagCashList: getCashBagCashList,
      createCashBagCash: createCashBagCash,
      updateCashBagCash: updateCashBagCash,
      getCashBagCreditList: getCashBagCreditList,
      createCashBagCredit: createCashBagCredit,
      updateCashBagCredit: updateCashBagCredit
    };

  });
