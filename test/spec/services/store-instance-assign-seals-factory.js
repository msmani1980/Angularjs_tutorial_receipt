'use strict';

describe('Service: storeInstanceAssignSealsFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceAssignSealsFactory;
  var storeInstanceSealService;
  var sealColorsService;
  var sealTypesService;
  beforeEach(inject(function (_storeInstanceAssignSealsFactory_, $injector) {
    storeInstanceAssignSealsFactory = _storeInstanceAssignSealsFactory_;
    storeInstanceSealService = $injector.get('storeInstanceSealService');
    sealColorsService = $injector.get('sealColorsService');
    sealTypesService = $injector.get('sealTypesService');

    spyOn(storeInstanceSealService, 'getStoreInstanceSeals');
    spyOn(sealColorsService, 'getSealColors');
    spyOn(sealTypesService, 'getSealTypes');
    spyOn(storeInstanceSealService, 'updateStoreInstanceSeal');
    spyOn(storeInstanceSealService, 'createStoreInstanceSeal');
  }));

  describe('storeInstanceSealService API calls', function(){
    it('should call getStoreInstanceSeals', function(){
      var id = 432;
      storeInstanceAssignSealsFactory.getStoreInstanceSeals(id);
      expect(storeInstanceSealService.getStoreInstanceSeals).toHaveBeenCalledWith(id);
    });
    it('should call updateStoreInstanceSeal', function(){
      var mockSealId = 17;
      var mockStoreInstanceId = 4;
      var mockPayload = {foo: 'barts'};
      storeInstanceAssignSealsFactory.updateStoreInstanceSeal(mockSealId, mockStoreInstanceId, mockPayload);
      expect(storeInstanceSealService.updateStoreInstanceSeal).toHaveBeenCalledWith(mockSealId, mockStoreInstanceId, mockPayload);
    });
    it('should call createStoreInstanceSeal', function(){
      var mockStoreInstanceId = 66;
      var mockPayload = {
        type: 4,
        sealNumbers: ['123']
      };
      storeInstanceAssignSealsFactory.createStoreInstanceSeal(mockStoreInstanceId, mockPayload);
      expect(storeInstanceSealService.createStoreInstanceSeal).toHaveBeenCalledWith(mockStoreInstanceId, mockPayload);
    });
  });

  describe('sealColorsService API calls', function(){
    it('should call getSealColors', function(){
      storeInstanceAssignSealsFactory.getSealColors();
      expect(sealColorsService.getSealColors).toHaveBeenCalled();
    });
  });

  describe('sealTypesService API calls', function(){
    it('should call getSealTypes', function(){
      storeInstanceAssignSealsFactory.getSealTypes();
      expect(sealTypesService.getSealTypes).toHaveBeenCalled();
    });
  });

});
