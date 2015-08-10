'use strict';

describe('Service: companyDiscountService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-discounts.json'));

  // instantiate service
  var companyDiscountService, $httpBackend, companyDiscountResponseJSON;

  beforeEach(inject(function (_companyDiscountService_) {
    inject(function (_servedCompanyDiscount_) {
      companyDiscountResponseJSON = _servedCompanyDiscount_;
    });
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/company-discounts/).respond(companyDiscountResponseJSON);

    companyDiscountService = _companyDiscountService_;
  }));

  it('should do something', function () {
    expect(!!companyDiscountService).toBe(true);
  });

  describe('API calls', function () {
    var discountData;

    describe('getDiscountList', function () {
      beforeEach(function () {
        menuService.getDiscountList().then(function (dataFromAPI) {
          discountData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(discountData.companyDiscounts.length).toBeGreaterThan(0);
      });

      it('should format the dates to MM/DD/YYYY', function () {
        expect(discountData.companyDiscounts[0].startDate).toBe('07/22/2015');
        expect(discountData.companyDiscounts[0].endDate).toBe('07/30/2015');
      });

      it('should have an discountTypeId property', function () {
        expect(discountData.companyDiscounts[0].discountTypeId).toBeDefined();
      });
    });
  });

});
