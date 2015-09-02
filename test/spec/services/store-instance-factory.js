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
  var storeInstanceService;
  var menuMasterService;
  var storesService;

  beforeEach(inject(function (_storeInstanceFactory_, $injector) {
    storeInstanceFactory = _storeInstanceFactory_;

    catererStationService = $injector.get('catererStationService');
    GlobalMenuService = $injector.get('GlobalMenuService');
    schedulesService = $injector.get('schedulesService');
    carrierService = $injector.get('carrierService');
    storeInstanceService = $injector.get('storeInstanceService');
    menuMasterService = $injector.get('menuMasterService');
    storesService = $injector.get('storesService');

    spyOn(catererStationService, 'getCatererStationList');
    spyOn(GlobalMenuService.company, 'get').and.returnValue(companyId);
    spyOn(schedulesService, 'getSchedules');
    spyOn(carrierService, 'getCarrierNumbers');
    spyOn(storeInstanceService, 'getStoreInstancesList');
    spyOn(storeInstanceService, 'getStoreInstance');
    spyOn(storeInstanceService, 'createStoreInstance');
    spyOn(storeInstanceService, 'updateStoreInstance');
    spyOn(storeInstanceService, 'deleteStoreInstance');
    spyOn(menuMasterService, 'getMenuMasterList');
    spyOn(storesService, 'getStoresList');
  }));

  describe('storesService calls', function(){
    it('should call getStoresList', function(){
      storeInstanceFactory.getStoresList();
      expect(storesService.getStoresList).toHaveBeenCalled();
    });
  });

  describe('menuMasterService calls', function(){
    it('should call getMenuMasterList', function(){
      storeInstanceFactory.getMenuMasterList();
      expect(menuMasterService.getMenuMasterList).toHaveBeenCalled();
    });
  });

  describe('storeInstanceService calls', function(){
    var id = 123;
    var mockPL = {foo:'bars'};
    it('should call getStoreInstancesList', function(){
      storeInstanceFactory.getStoreInstancesList(mockPL);
      expect(storeInstanceService.getStoreInstancesList).toHaveBeenCalledWith(mockPL);
    });
    it('should call getStoreInstance', function(){
      storeInstanceFactory.getStoreInstance(id);
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalledWith(id);
    });
    it('should call createStoreInstance', function(){
      storeInstanceFactory.createStoreInstance(mockPL);
      expect(storeInstanceService.createStoreInstance).toHaveBeenCalledWith(mockPL);
    });
    it('should call updateStoreInstance', function(){
      storeInstanceFactory.updateStoreInstance(id, mockPL);
      expect(storeInstanceService.updateStoreInstance).toHaveBeenCalledWith(id, mockPL);
    });
    it('should call deleteStoreInstance', function(){
      storeInstanceFactory.deleteStoreInstance(id);
      expect(storeInstanceService.deleteStoreInstance).toHaveBeenCalledWith(id);
    });
  });

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
      var carrierTypeId = 1;
      storeInstanceFactory.getCarrierNumbers(companyId,1);
      expect(carrierService.getCarrierNumbers).toHaveBeenCalledWith(companyId,carrierTypeId);
    });
    it('should call getAllCarrierNumbers', function(){
      var carrierTypeId = 0;
      storeInstanceFactory.getAllCarrierNumbers(companyId);
      expect(carrierService.getCarrierNumbers).toHaveBeenCalledWith(companyId,carrierTypeId);
    });

  });

});
