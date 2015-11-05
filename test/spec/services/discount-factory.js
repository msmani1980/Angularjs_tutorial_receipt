'use strict';

describe('Service: discountFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var discountFactory,
    discountService,
    discountTypesService;

  beforeEach(inject(function (_discountFactory_, $injector) {
    discountService = $injector.get('discountService');
    discountTypesService = $injector.get('discountTypesService');

    spyOn(discountService, 'getDiscountList').and.stub();
    spyOn(discountTypesService, 'getDiscountTypesList').and.stub();
    spyOn(discountService, 'deleteDiscount').and.stub();

    discountFactory = _discountFactory_;
  }));

  it('should exists', function () {
    expect(!!discountFactory).toBe(true);
  });

  describe('API Calls', function(){

    it('should call discountService.getDiscountList with a payload', function () {
      var payload = {
        fake: 'data'
      };
      discountFactory.getDiscountList(payload);
      expect(discountService.getDiscountList).toHaveBeenCalledWith(payload);
    });

    it('should call discountService.getDiscountTypesList with a payload', function () {
      var payload = {
        fake: 'data'
      };
      discountFactory.getDiscountTypesList(payload);
      expect(discountTypesService.getDiscountTypesList).toHaveBeenCalledWith(payload);
    });

    it('should call discountService.deleteDiscount with a discount id', function () {
      discountFactory.deleteDiscount(1);
      expect(discountService.deleteDiscount).toHaveBeenCalledWith(1);
    });

  });
});
