'use strict';

describe('Service: deliveryNoteFactory', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var deliveryNoteFactory;
  var deliveryNotesService;
  var catererStationService;
  var itemsService;
  var companyReasonCodesService;
  var stockManagementStationItemsService;
  var recordsService;
  var menuService;
  var menuCatererStationsService;

  beforeEach(inject(function(_deliveryNoteFactory_, $injector) {
    deliveryNoteFactory = _deliveryNoteFactory_;
    deliveryNotesService = $injector.get('deliveryNotesService');
    catererStationService = $injector.get('catererStationService');
    stockManagementStationItemsService = $injector.get('stockManagementStationItemsService');
    itemsService = $injector.get('itemsService');
    companyReasonCodesService = $injector.get('companyReasonCodesService');
    recordsService = $injector.get('recordsService');
    menuService = $injector.get('menuService');
    menuCatererStationsService = $injector.get('menuCatererStationsService');

    spyOn(deliveryNotesService, 'getDeliveryNote');
    spyOn(catererStationService, 'getCatererStationList');
    spyOn(stockManagementStationItemsService, 'getStockManagementStationItems');
    spyOn(itemsService, 'getItemsList');
    spyOn(companyReasonCodesService, 'getAll');
    spyOn(deliveryNotesService, 'createDeliveryNote');
    spyOn(deliveryNotesService, 'saveDeliveryNote');
    spyOn(catererStationService, 'getAllMenuItems');
    spyOn(recordsService, 'getItemTypes');
    spyOn(recordsService, 'getCharacteristics');
    spyOn(menuService, 'getMenuList');
    spyOn(menuCatererStationsService, 'getRelationshipList');

  }));

  describe('deliveryNotesService calls', function() {
    it('should call getDeliveryNote', function() {
      var id = 123;
      deliveryNoteFactory.getDeliveryNote(id);
      expect(deliveryNotesService.getDeliveryNote).toHaveBeenCalledWith(id);
    });

    it('should call createDeliveryNote', function() {
      var obj = {
        id: 123
      };
      deliveryNoteFactory.createDeliveryNote(obj);
      obj.isAccepted = false;
      expect(deliveryNotesService.createDeliveryNote).toHaveBeenCalledWith(obj);
    });

    it('should call saveDeliveryNote', function() {
      var obj = {
        id: 123,
        isAccepted: true
      };
      deliveryNoteFactory.saveDeliveryNote(obj);
      expect(deliveryNotesService.saveDeliveryNote).toHaveBeenCalledWith(obj);
    });
  });

  describe('catererStationService calls', function() {
    it('should call getCatererStation', function() {
      deliveryNoteFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('stockManagementStationItemsService calls', function() {
    it('should call getStockManagementStationItems', function() {
      var csid = 1;
      deliveryNoteFactory.getItemsByCateringStationId(csid);
      expect(stockManagementStationItemsService.getStockManagementStationItems).toHaveBeenCalledWith(csid);
    });
  });

  describe('itemsService calls', function() {
    it('should call getItemsList to get all master items', function() {
      var mockPayload = {};
      deliveryNoteFactory.getMasterItems(mockPayload);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(mockPayload, true);
    });
  });

  describe('companyReasonCodesService calls', function() {
    it('should call getCompanyReasonCodes', function() {
      deliveryNoteFactory.getCompanyReasonCodes();
      expect(companyReasonCodesService.getAll).toHaveBeenCalled();
    });
  });

  describe('recordsService calls', function() {
    it('should call getItemTypes', function() {
      deliveryNoteFactory.getItemTypes();
      expect(recordsService.getItemTypes).toHaveBeenCalled();
    });
    it('should call getCharacteristics', function() {
      deliveryNoteFactory.getCharacteristics();
      expect(recordsService.getCharacteristics).toHaveBeenCalled();
    });
  });

  describe('menuService calls', function() {
    it('should call getMenuList', function() {
      var fakePayload = {fakeKey: 'fakeValue'};
      deliveryNoteFactory.getMenuList(fakePayload);
      expect(menuService.getMenuList).toHaveBeenCalledWith(fakePayload, false);
    });
  });

  describe('menuCatererStationsService calls', function() {
    it('should call getCompanyReasonCodes', function() {
      var fakePayload = {fakeKey: 'fakeValue'};
      deliveryNoteFactory.getMenuCatererStationList(fakePayload);
      expect(menuCatererStationsService.getRelationshipList).toHaveBeenCalledWith(fakePayload);
    });
  });

});
