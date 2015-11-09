'use strict';

describe('Service: deliveryNoteFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var deliveryNoteFactory;
  var deliveryNotesService;
  var catererStationService;
  var itemsService;
  var companyReasonCodesService;
  var stockManagementStationItemsService;

  beforeEach(inject(function (_deliveryNoteFactory_, $injector) {
    deliveryNoteFactory = _deliveryNoteFactory_;
    deliveryNotesService = $injector.get('deliveryNotesService');
    catererStationService = $injector.get('catererStationService');
    stockManagementStationItemsService = $injector.get('stockManagementStationItemsService');
    itemsService = $injector.get('itemsService');
    companyReasonCodesService = $injector.get('companyReasonCodesService');

    spyOn(deliveryNotesService, 'getDeliveryNote');
    spyOn(catererStationService, 'getCatererStationList');
    spyOn(stockManagementStationItemsService, 'getStockManagementStationItems');
    spyOn(itemsService, 'getItemsList');
    spyOn(companyReasonCodesService, 'getAll');
    spyOn(deliveryNotesService, 'createDeliveryNote');
    spyOn(deliveryNotesService, 'saveDeliveryNote');
    spyOn(catererStationService, 'getAllMenuItems');

  }));

  describe('deliveryNotesService calls', function(){
    it('should call getDeliveryNote', function(){
      var id = 123;
      deliveryNoteFactory.getDeliveryNote(id);
      expect(deliveryNotesService.getDeliveryNote).toHaveBeenCalledWith(id);
    });
    it('should call createDeliveryNote', function(){
      var obj = {id: 123};
      deliveryNoteFactory.createDeliveryNote(obj);
      obj.isAccepted = false;
      expect(deliveryNotesService.createDeliveryNote).toHaveBeenCalledWith(obj);
    });
    it('should call saveDeliveryNote', function(){
      var obj = {id: 123, isAccepted: true};
      deliveryNoteFactory.saveDeliveryNote(obj);
      expect(deliveryNotesService.saveDeliveryNote).toHaveBeenCalledWith(obj);
    });
  });

  describe('catererStationService calls', function(){
    it('should call getCatererStation', function(){
      deliveryNoteFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('stockManagementStationItemsService calls', function(){
    it('should call getStockManagementStationItems', function(){
      var csid = 1;
      deliveryNoteFactory.getItemsByCateringStationId(csid);
      expect(stockManagementStationItemsService.getStockManagementStationItems).toHaveBeenCalledWith(csid);
    });
  });

  describe('itemsService calls', function(){
    it('should call getItemsList to get all master items', function(){
      deliveryNoteFactory.getAllMasterItems();
      expect(itemsService.getItemsList).toHaveBeenCalledWith({}, true);
    });
  });

  describe('companyReasonCodesService calls', function(){
    it('should call getCompanyReasonCodes', function(){
      deliveryNoteFactory.getCompanyReasonCodes();
      expect(companyReasonCodesService.getAll).toHaveBeenCalled();
    });
  });

});
