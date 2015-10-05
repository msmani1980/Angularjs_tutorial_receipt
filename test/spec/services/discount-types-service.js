'use strict';

describe('Service: discountTypesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-discount-types.json'));

  // instantiate service
  var discountTypesService,
    $httpBackend,
    discountTypesResponseJSON;

  beforeEach(inject(function (_discountTypesService_, $injector) {
    inject(function (_servedCompanyDiscountTypes_) {
      discountTypesResponseJSON = _servedCompanyDiscountTypes_;
    });
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/discounts/).respond(discountTypesResponseJSON);
    discountTypesService = _discountTypesService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!discountTypesService).toBe(true);
  });

  describe('API calls', function () {
    var discountTypesData;

    describe('getDiscountTypesList', function () {
      beforeEach(function () {
        discountTypesService.getDiscountTypesList().then(function (discountTypesListFromAPI) {
          discountTypesData = discountTypesListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(discountTypesData.discounts.length).toBeGreaterThan(0);
      });

      it('should have a discountTypeName name property', function () {
        expect(discountTypesData.discounts[0].id).toBe(2);
      });
      it('should have a discountTypeName name property', function () {
        expect(discountTypesData.discounts[0].description).toBe('Comp');
      });
      it('should have a discountTypeName name property', function () {
        expect(discountTypesData.discounts[0].globalDiscountTypeName).toBe('Comp');
      });
    });

    describe('search Discount Types', function () {
      it('should fetch and return discountTypesList', function () {
        spyOn(discountTypesService, 'getDiscountTypesList').and.callThrough();
        var payload = {
          someKey: 'someValue'
        };
        discountTypesService.getDiscountTypesList(payload);
        $httpBackend.flush();
        expect(discountTypesService.getDiscountTypesList).toHaveBeenCalledWith(payload);
      });
    });

  });
  
});
