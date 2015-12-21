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
    spyOn(discountService, 'getDiscount').and.stub();
    spyOn(discountService, 'createDiscount').and.stub();
    spyOn(discountService, 'updateDiscount').and.stub();

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

    it('should get discount', function() {
      discountFactory.getDiscount(1);
      expect(discountService.getDiscount).toHaveBeenCalledWith(1);
    });


    it('should create discount', function() {
      discountFactory.createDiscount({id:1});
      expect(discountService.createDiscount).toHaveBeenCalledWith({id:1});
    });


    it('should update discount', function() {
      discountFactory.updateDiscount(1, {name: 'discount'});
      expect(discountService.updateDiscount).toHaveBeenCalledWith(1, {name: 'discount'});
    });
  });
});
