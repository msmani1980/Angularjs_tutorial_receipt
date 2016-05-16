'use strict';

describe('Service: manualEposFactory', function() {

  beforeEach(module('ts5App'));

  var manualEposFactory;
  var currenciesService;
  var dailyExchangeRatesService;
  var cashBagService;
  var storeInstanceService;
  var itemsService;
  var recordsService;

  beforeEach(inject(function(_manualEposFactory_, _currenciesService_, _dailyExchangeRatesService_, _cashBagService_, _storeInstanceService_, _itemsService_, _recordsService_) {
    manualEposFactory = _manualEposFactory_;
    currenciesService = _currenciesService_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;
    cashBagService = _cashBagService_;
    storeInstanceService = _storeInstanceService_;
    itemsService = _itemsService_;
    recordsService = _recordsService_;

    spyOn(manualEposFactory, 'getPromotionsList');
    spyOn(manualEposFactory, 'getDiscountsList');

    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(dailyExchangeRatesService, 'getDailyExchangeById');
    spyOn(cashBagService, 'getCashBag');
    spyOn(cashBagService, 'getManualCashBagList');
    spyOn(cashBagService, 'verifyCashBag');
    spyOn(cashBagService, 'unverifyCashBag');
    spyOn(cashBagService, 'getCashBagVerifications');
    spyOn(cashBagService, 'createManualCashBagRecord');
    spyOn(cashBagService, 'updateManualCashBagRecord');
    spyOn(storeInstanceService, 'getStoreInstance');
    spyOn(itemsService, 'getItemsList');
    spyOn(recordsService, 'getItemTypes');
  }));

  describe('getPromotionsList API call', function() {
    it('should call getPromotionsList', function() {
      manualEposFactory.getPromotionsList();
      expect(manualEposFactory.getPromotionsList).toHaveBeenCalled();
    });
  });

  describe('getDiscountsList API call', function() {
    it('should call getDiscountsList', function() {
      manualEposFactory.getDiscountsList();
      expect(manualEposFactory.getDiscountsList).toHaveBeenCalled();
    });
  });

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

  describe('cash bag service API call', function () {
    it('should call getCashBag from cashBagService', function () {
      manualEposFactory.getCashBag();
      expect(cashBagService.getCashBag).toHaveBeenCalled();
    });

    it('should call getCashBagCash from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakePayload = {};
      manualEposFactory.getCashBagCashList(fakeCashBagId, fakePayload);
      expect(cashBagService.getManualCashBagList).toHaveBeenCalledWith('cash', fakeCashBagId, fakePayload);
    });

    it('should call createCashBagCash from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakePayload = {};
      manualEposFactory.createCashBagCash(fakeCashBagId, fakePayload);
      expect(cashBagService.createManualCashBagRecord).toHaveBeenCalledWith('cash', fakeCashBagId, fakePayload);
    });

    it('should call updateCashBagCash from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakeCashBagCashId = 234;
      var fakePayload = {};
      manualEposFactory.updateCashBagCash(fakeCashBagId, fakeCashBagCashId, fakePayload);
      expect(cashBagService.updateManualCashBagRecord).toHaveBeenCalledWith('cash', fakeCashBagId, fakeCashBagCashId, fakePayload);
    });

    it('should call getCashBagCredit from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakePayload = {};
      manualEposFactory.getCashBagCreditList(fakeCashBagId, fakePayload);
      expect(cashBagService.getManualCashBagList).toHaveBeenCalledWith('credit-cards', fakeCashBagId, fakePayload);
    });

    it('should call createCashBagCredit from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakePayload = {};
      manualEposFactory.createCashBagCredit(fakeCashBagId, fakePayload);
      expect(cashBagService.createManualCashBagRecord).toHaveBeenCalledWith('credit-cards', fakeCashBagId, fakePayload);
    });

    it('should call updateCashBagCredit from cashBagService', function () {
      var fakeCashBagId = 123;
      var fakeCashBagCashId = 234;
      var fakePayload = {};
      manualEposFactory.updateCashBagCredit(fakeCashBagId, fakeCashBagCashId, fakePayload);
      expect(cashBagService.updateManualCashBagRecord).toHaveBeenCalledWith('credit-cards', fakeCashBagId, fakeCashBagCashId, fakePayload);
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
