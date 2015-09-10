'use strict';

describe('Service: storeInstanceReviewFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceReviewFactory;
  var storeInstanceSealService;
  var sealColorsService;
  var sealTypesService;

  beforeEach(inject(function (_storeInstanceReviewFactory_, $injector) {
    storeInstanceReviewFactory = _storeInstanceReviewFactory_;
    storeInstanceSealService = $injector.get('storeInstanceSealService');
    sealColorsService = $injector.get('sealColorsService');
    sealTypesService = $injector.get('sealTypesService');

    spyOn(storeInstanceSealService, 'getStoreInstanceSeals');
    spyOn(sealColorsService, 'getSealColors');
    spyOn(sealTypesService, 'getSealTypes');

  }));

  describe('storeInstanceSealService API calls', function(){
    it('should call getStoreInstanceSeals', function(){
      var id = 432;
      storeInstanceReviewFactory.getStoreInstanceSeals(id);
      expect(storeInstanceSealService.getStoreInstanceSeals).toHaveBeenCalledWith(id);
    });
  });

  describe('sealColorsService API calls', function(){
    it('should call getSealColors', function(){
      storeInstanceReviewFactory.getSealColors();
      expect(sealColorsService.getSealColors).toHaveBeenCalled();
    });
  });

  describe('sealTypesService API calls', function(){
    it('should call getSealTypes', function(){
      storeInstanceReviewFactory.getSealTypes();
      expect(sealTypesService.getSealTypes).toHaveBeenCalled();
    });
  });

});
