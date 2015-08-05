'use strict';

describe('Service: deliveryNoteFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var deliveryNoteFactory;
  var deliveryNotesService;
  var catererStationService;
  var GlobalMenuService;
  var menuCatererStationsService;

  beforeEach(inject(function (_deliveryNoteFactory_, $injector) {
    deliveryNoteFactory = _deliveryNoteFactory_;
    deliveryNotesService = $injector.get('deliveryNotesService');
    catererStationService = $injector.get('catererStationService');
    GlobalMenuService = $injector.get('GlobalMenuService');
    menuCatererStationsService = $injector.get('menuCatererStationsService');

    spyOn(deliveryNotesService, 'getDeliveryNote');
    spyOn(catererStationService, 'getCatererStationList');
    spyOn(GlobalMenuService.company, 'get');
    spyOn(menuCatererStationsService, 'getRelationshipList');

  }));

  describe('deliveryNotesService calls', function(){
    it('should call getDeliveryNote', function(){
      var id = 123;
      deliveryNoteFactory.getDeliveryNote(id);
      expect(deliveryNotesService.getDeliveryNote).toHaveBeenCalledWith(id);
    });
  });

  describe('catererStationService calls', function(){
    it('should call getCatererStation', function(){
      deliveryNoteFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('GlobalMenuService calls', function(){
    it('should call company.get', function(){
      deliveryNoteFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });

  describe('menuCatererStationsService calls', function(){
    it('should call getRelationshipList', function(){
      deliveryNoteFactory.getCompanyMenuCatererStations();
      expect(menuCatererStationsService.getRelationshipList).toHaveBeenCalled();
    });
  });

});
