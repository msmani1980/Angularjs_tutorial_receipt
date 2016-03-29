'use strict';

describe('Service: manualEposFactory', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var manualEposFactory;
  beforeEach(inject(function(_manualEposFactory_) {
    manualEposFactory = _manualEposFactory_;
    spyOn(manualEposFactory, 'getPromotionsList');
    spyOn(manualEposFactory, 'getCurrencyList');
    spyOn(manualEposFactory, 'getVoucherItemsList');
    spyOn(manualEposFactory, 'getVirtualItemsList');
    spyOn(manualEposFactory, 'getDiscountsList');
    spyOn(manualEposFactory, 'getCashList');
    spyOn(manualEposFactory, 'getCreditList');

  }));

  describe('getCurrencyList API call', function() {
    it('should call getCurrencyList', function() {
      manualEposFactory.getCurrencyList();
      expect(manualEposFactory.getCurrencyList).toHaveBeenCalled();
    });
  });

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

});
