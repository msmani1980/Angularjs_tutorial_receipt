'use strict';

describe('Service: storeInstanceFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceFactory;
  var catererStationService;
  var GlobalMenuService;
  var companyId = 403;
  var schedulesService;
  var carrierService;

  beforeEach(inject(function (_storeInstanceFactory_, $injector) {
    storeInstanceFactory = _storeInstanceFactory_;

    catererStationService = $injector.get('catererStationService');
    GlobalMenuService = $injector.get('GlobalMenuService');
    schedulesService = $injector.get('schedulesService');
    carrierService = $injector.get('carrierService');

    spyOn(catererStationService, 'getCatererStationList');
    spyOn(GlobalMenuService.company, 'get').and.returnValue(companyId);
    spyOn(schedulesService, 'getSchedules');
    spyOn(carrierService, 'getCarrierNumbers');
  }));

  describe('GlobalMenuService calls', function() {
    it('should get company', function () {
      storeInstanceFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });

  describe('catererStationService calls', function(){
    it('should call getCatererStation', function(){
      storeInstanceFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('schedulesService calls', function(){
    it('should call getSchedules', function(){
      storeInstanceFactory.getSchedules(companyId);
      expect(schedulesService.getSchedules).toHaveBeenCalledWith(companyId);
    });
  });

  describe('carrierService calls', function(){
    it('should call getCarrierNumbers', function(){
      storeInstanceFactory.getCarrierNumbers(companyId);
      expect(carrierService.getCarrierNumbers).toHaveBeenCalledWith(companyId);
    });
  });

});
