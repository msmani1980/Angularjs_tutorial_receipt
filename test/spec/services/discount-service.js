'use strict';

describe('Service: discountService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-discounts.json'));

  // instantiate service
  var discountService,
    $httpBackend,
    discountResponseJSON;

  beforeEach(inject(function (_discountService_, $injector) {
    inject(function (_servedCompanyDiscounts_) {
      discountResponseJSON = _servedCompanyDiscounts_;
    });
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/company-discounts/).respond(discountResponseJSON);
    $httpBackend.whenDELETE(/company-discounts/).respond(201);
    discountService = _discountService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!discountService).toBe(true);
  });

  describe('API calls', function () {
    var discountData;

    describe('getDiscountList', function () {
      beforeEach(function () {
        discountService.getDiscountList().then(function (discountListFromAPI) {
          discountData = discountListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(discountData.companyDiscounts.length).toBeGreaterThan(0);
      });

      it('should have a discountTypeName name property', function () {
        expect(discountData.companyDiscounts[0].companyId).toBe(403);
      });
      it('should have a discountTypeName name property', function () {
        expect(discountData.companyDiscounts[0].discountTypeId).toBe(4);
      });
      it('should have a discountTypeName name property', function () {
        expect(discountData.companyDiscounts[0].discountTypeName).toBe('Voucher');
      });
      it('should have a discountTypeName name property', function () {
        expect(discountData.companyDiscounts[0].name).toBe('10 % ');
      });
      it('should have a discountTypeName name property', function () {
        expect(discountData.companyDiscounts[0].rateTypeId).toBe(1);
      });
      it('should have a discountTypeName name property', function () {
        expect(discountData.companyDiscounts[0].rateTypeName).toBe('Percentage');
      });
      it('should have a discountTypeName name property', function () {
        expect(discountData.companyDiscounts[0].companyDiscountRestrictions).toBe(false);
      });
    });

    describe('search Discounts', function () {
      it('should fetch and return discountList', function () {
        spyOn(discountService, 'getDiscountList').and.callThrough();
        var payload = {
          someKey: 'someValue'
        };
        discountService.getDiscountList(payload);
        $httpBackend.flush();
        expect(discountService.getDiscountList).toHaveBeenCalledWith(payload);
      });
    });

    it('should delete discount by discount id', function () {
      $httpBackend.expectDELETE(/company-discounts/);
      discountService.deleteDiscount(1);
      $httpBackend.flush();
    });

  });
});
