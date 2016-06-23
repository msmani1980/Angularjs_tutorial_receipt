'use strict';

describe('Service: manualEposFactory', function () {

  beforeEach(module('ts5App'));

  var manualEposFactory;
  var currenciesService;
  var dailyExchangeRatesService;
  var cashBagService;
  var storeInstanceService;
  var itemsService;
  var recordsService;
  var companyDiscountService;
  var promotionsService;

  beforeEach(inject(function (_manualEposFactory_, _currenciesService_, _dailyExchangeRatesService_, _cashBagService_, _storeInstanceService_, _itemsService_, _recordsService_,
                              _companyDiscountService_, _promotionsService_) {
    manualEposFactory = _manualEposFactory_;
    currenciesService = _currenciesService_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;
    cashBagService = _cashBagService_;
    storeInstanceService = _storeInstanceService_;
    itemsService = _itemsService_;
    recordsService = _recordsService_;
    companyDiscountService = _companyDiscountService_;
    promotionsService = _promotionsService_;

    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(dailyExchangeRatesService, 'getDailyExchangeById');
    spyOn(cashBagService, 'getCashBag');
    spyOn(cashBagService, 'getManualCashBagList');
    spyOn(cashBagService, 'verifyCashBag');
    spyOn(cashBagService, 'unverifyCashBag');
    spyOn(cashBagService, 'getCashBagVerifications');
    spyOn(cashBagService, 'createManualCashBagRecord');
    spyOn(cashBagService, 'updateManualCashBagRecord');
    spyOn(cashBagService, 'getManualCashBagCashList');
    spyOn(cashBagService, 'createManualCashBagCashRecord');
    spyOn(cashBagService, 'updateManualCashBagCashRecord');
    spyOn(cashBagService, 'getAllManualCashList');
    spyOn(storeInstanceService, 'getStoreInstance');
    spyOn(itemsService, 'getItemsList');
    spyOn(recordsService, 'getItemTypes');
    spyOn(companyDiscountService, 'getDiscountList');
    spyOn(promotionsService, 'getPromotions');

  }));

  describe('getCurrencyList API call', function () {
    it('should call getCurrencyList from currenciesService', function () {
      manualEposFactory.getCurrencyList({});
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalled();
    });
  });

  describe('getDailyExchangeRate API call', function () {
    it('should call getDailyExchangeRate from dailyExchangeRatesService', function () {
      manualEposFactory.getDailyExchangeRate();
      expect(dailyExchangeRatesService.getDailyExchangeById).toHaveBeenCalled();
    });
  });

  describe('company discounts service API calls', function () {
    it('should call getDiscountList on getCompanyDiscountsCoupon', function () {
      manualEposFactory.getCompanyDiscountsCoupon({});
      expect(companyDiscountService.getDiscountList).toHaveBeenCalled();
    });

    it('should call getDiscountList on getCompanyDiscountsVoucher', function () {
      manualEposFactory.getCompanyDiscountsVoucher();
      expect(companyDiscountService.getDiscountList).toHaveBeenCalled();
    });

    it('should call getDiscountList on getCompanyDiscountsComp', function () {
      manualEposFactory.getCompanyDiscountsComp();
      expect(companyDiscountService.getDiscountList).toHaveBeenCalled();
    });

    it('should call getDiscountList on getCompanyDiscountsFrequentFlyer', function () {
      manualEposFactory.getCompanyDiscountsFrequentFlyer();
      expect(companyDiscountService.getDiscountList).toHaveBeenCalled();
    });
  });


  describe('promotions service API call', function () {
    it('should call getPromotion on getCompanyPromotionsList', function () {
      manualEposFactory.getCompanyPromotionsList();
      expect(promotionsService.getPromotions).toHaveBeenCalled();
    });
  });

  describe('cash bag service API call', function () {
    it('should call getCashBag from cashBagService', function () {
      manualEposFactory.getCashBag();
      expect(cashBagService.getCashBag).toHaveBeenCalled();
    });

    it('should call getAllManualCashList from cashBagService', function () {
      manualEposFactory.getAllManualCashList();
      expect(cashBagService.getAllManualCashList).toHaveBeenCalled();
    });

    it('should call getCashBagCash from cashBagService', function () {
      var fakeCashBagId = 123;
      manualEposFactory.getCashBagCashList(fakeCashBagId, {});
      expect(cashBagService.getManualCashBagCashList).toHaveBeenCalledWith(fakeCashBagId, {});
    });

    it('should call createCashBagCash from cashBagService', function () {
      var fakeCashBagId = 123;
      manualEposFactory.createCashBagCash(fakeCashBagId, {});
      expect(cashBagService.createManualCashBagCashRecord).toHaveBeenCalledWith(fakeCashBagId, {});
    });

    it('should call updateCashBagCash from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakeCashBagCashId = 234;
      manualEposFactory.updateCashBagCash(fakeCashBagId, fakeCashBagCashId, {});
      expect(cashBagService.updateManualCashBagCashRecord).toHaveBeenCalledWith(fakeCashBagId, fakeCashBagCashId, {});
    });

    it('should call getCashBagCredit from cashBagService', function () {
      var fakeCashBagId = 123;
      manualEposFactory.getCashBagCreditList(fakeCashBagId, {});
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      expect(cashBagService.getManualCashBagList).toHaveBeenCalledWith('credit-cards', expectedPayload);
    });

    it('should call createCashBagCredit from cashBagService', function () {
      var fakeCashBagId = 123;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.createCashBagCredit(fakeCashBagId, {});
      expect(cashBagService.createManualCashBagRecord).toHaveBeenCalledWith('credit-cards', expectedPayload);
    });

    it('should call updateCashBagCredit from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakeRecordId = 234;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.updateCashBagCredit(fakeCashBagId, fakeRecordId, {});
      expect(cashBagService.updateManualCashBagRecord).toHaveBeenCalledWith('credit-cards', fakeRecordId, expectedPayload);
    });

    it('should call getCashBagItemList from cashBagService', function () {
      var fakeCashBagId = 123;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.getCashBagItemList(fakeCashBagId, {});
      expect(cashBagService.getManualCashBagList).toHaveBeenCalledWith('items', expectedPayload);
    });

    it('should call createCashBagItem from cashBagService', function () {
      var fakeCashBagId = 123;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.createCashBagItem(fakeCashBagId, {});
      expect(cashBagService.createManualCashBagRecord).toHaveBeenCalledWith('items', expectedPayload);
    });

    it('should call updateCashBagItem from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakeItemId = 234;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.updateCashBagItem(fakeCashBagId, fakeItemId, {});
      expect(cashBagService.updateManualCashBagRecord).toHaveBeenCalledWith('items', fakeItemId, expectedPayload);
    });

    it('should call verifyCashBag from cashBagService', function () {
      manualEposFactory.verifyCashBag();
      expect(cashBagService.verifyCashBag).toHaveBeenCalled();
    });

    it('should call unverifyCashBag from cashBagService', function () {
      manualEposFactory.unverifyCashBag();
      expect(cashBagService.unverifyCashBag).toHaveBeenCalled();
    });

    it('should call checkCashBagVerification from cashBagService', function () {
      manualEposFactory.checkCashBagVerification();
      expect(cashBagService.getCashBagVerifications).toHaveBeenCalled();
    });

    it('should call getCashBagPromotionList from cashBagService', function () {
      var fakeCashBagId = 123;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.getCashBagPromotionList(fakeCashBagId, {});
      expect(cashBagService.getManualCashBagList).toHaveBeenCalledWith('promotions', expectedPayload);
    });

    it('should call createManualEposPromotion', function () {
      var fakeCashBagId = 123;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.createManualEposPromotion(fakeCashBagId, {});
      expect(cashBagService.createManualCashBagRecord).toHaveBeenCalledWith('promotions', expectedPayload);
    });

    it('should call updateManualEposPromotion', function () {
      var fakeCashBagId = 123;
      var fakeRecordId = 234;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.updateManualEposPromotion(fakeCashBagId, fakeRecordId, {});
      expect(cashBagService.updateManualCashBagRecord).toHaveBeenCalledWith('promotions', fakeRecordId, expectedPayload);
    });

    it('should call getCashBagDiscountList from cashBagService', function () {
      var fakeCashBagId = 123;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.getCashBagDiscountList(fakeCashBagId, {});
      expect(cashBagService.getManualCashBagList).toHaveBeenCalledWith('discounts', expectedPayload);
    });

    it('should call createCashBagDiscount from cashBagService', function () {
      var fakeCashBagId = 123;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.createCashBagDiscount(fakeCashBagId, {});
      expect(cashBagService.createManualCashBagRecord).toHaveBeenCalledWith('discounts', expectedPayload);
    });

    it('should call updateCashBagDiscount from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakeCashBagDiscountId = 234;
      var expectedPayload = {
        cashbagId: fakeCashBagId
      };
      manualEposFactory.updateCashBagDiscount(fakeCashBagId, fakeCashBagDiscountId, {});
      expect(cashBagService.updateManualCashBagRecord).toHaveBeenCalledWith('discounts', fakeCashBagDiscountId, expectedPayload);
    });

  });

  describe('storeInstanceService API call', function () {
    it('should call getStoreInstance from storeInstanceService', function () {
      manualEposFactory.getStoreInstance();
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalled();
    });
  });

  describe('itemService API call', function () {
    it('should get master items from itemService', function () {
      manualEposFactory.getRetailItems({});
      expect(itemsService.getItemsList).toHaveBeenCalledWith({}, true);
    });
  });

  describe('recordsService API call', function () {
    it('should getItemTypes from recordsService', function () {
      manualEposFactory.getItemTypes();
      expect(recordsService.getItemTypes).toHaveBeenCalled();
    });
  });

});
