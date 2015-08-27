'use strict';

describe('Service: storeInstanceFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceFactory;
  var catererStationService;
  beforeEach(inject(function (_storeInstanceFactory_, $injector) {
    storeInstanceFactory = _storeInstanceFactory_;

    catererStationService = $injector.get('catererStationService');

    spyOn(catererStationService, 'getCatererStationList');
  }));

  describe('catererStationService calls', function(){
    it('should call getCatererStation', function(){
      deliveryNoteFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

});
