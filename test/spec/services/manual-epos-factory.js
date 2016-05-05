'use strict';

describe('Service: manualEposFactory', function() {

  beforeEach(module('ts5App'));

  var manualEposFactory;
  var currenciesService;
  var dailyExchangeRatesService;
  var cashBagService;
  var storeInstanceService;

  beforeEach(inject(function(_manualEposFactory_, _currenciesService_, _dailyExchangeRatesService_, _cashBagService_, _storeInstanceService_) {
    manualEposFactory = _manualEposFactory_;
    currenciesService = _currenciesService_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;
    cashBagService = _cashBagService_;
    storeInstanceService = _storeInstanceService_;

    spyOn(manualEposFactory, 'getPromotionsList');
    spyOn(manualEposFactory, 'getVoucherItemsList');
    spyOn(manualEposFactory, 'getVirtualItemsList');
    spyOn(manualEposFactory, 'getDiscountsList');
    spyOn(manualEposFactory, 'getCashList');
    spyOn(manualEposFactory, 'getCreditList');

    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(dailyExchangeRatesService, 'getDailyExchangeById');
    spyOn(cashBagService, 'getCashBag');
    spyOn(cashBagService, 'getCashBagCashList');
    spyOn(cashBagService, 'verifyCashBag');
    spyOn(cashBagService, 'unverifyCashBag');
    spyOn(cashBagService, 'getCashBagVerifications');
    spyOn(storeInstanceService, 'getStoreInstance');
  }));

  describe('getPromotionsList API call', function() {
    it('should call getPromotionsList', function() {
      manualEposFactory.getPromotionsList();
      expect(manualEposFactory.getPromotionsList).toHaveBeenCalled();
    });
  });

  describe('getVoucherItemsList API call', function() {
    it('should call getVoucherItemsList', function() {
      manualEposFactory.getVoucherItemsList();
      expect(manualEposFactory.getVoucherItemsList).toHaveBeenCalled();
    });
  });

  describe('getVirtualItemsList API call', function() {
    it('should call getVirtualItemsList', function() {
      manualEposFactory.getVirtualItemsList();
      expect(manualEposFactory.getVirtualItemsList).toHaveBeenCalled();
    });
  });

  describe('getDiscountsList API call', function() {
    it('should call getDiscountsList', function() {
      manualEposFactory.getDiscountsList();
      expect(manualEposFactory.getDiscountsList).toHaveBeenCalled();
    });
  });

  describe('getCashList API call', function() {
    it('should call getCashList', function() {
      manualEposFactory.getCashList();
      expect(manualEposFactory.getCashList).toHaveBeenCalled();
    });
  });

  describe('getCreditList API call', function() {
    it('should call getCreditList', function() {
      manualEposFactory.getCreditList();
      expect(manualEposFactory.getCreditList).toHaveBeenCalled();
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

  describe('getCashBag API call', function () {
    it('should call getCashBag from cashBagService', function () {
      manualEposFactory.getCashBag();
      expect(cashBagService.getCashBag).toHaveBeenCalled();
    });

    it('should call getCashBag from cashBagService', function () {
      manualEposFactory.getCashBagCashList();
      expect(cashBagService.getCashBagCashList).toHaveBeenCalled();
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

});
