'use strict';

describe('Service: deliveryNoteFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var deliveryNoteFactory;
  var deliveryNotesService;
  var catererStationService;
  var GlobalMenuService;

  beforeEach(inject(function (_deliveryNoteFactory_, _deliveryNotesService_, _catererStationService_, _GlobalMenuService_) {
    deliveryNoteFactory = _deliveryNoteFactory_;
    deliveryNotesService = _deliveryNotesService_;
    catererStationService = _catererStationService_;
    GlobalMenuService = _GlobalMenuService_;

    spyOn(deliveryNotesService, 'getDeliveryNote');
    spyOn(catererStationService, 'getCatererStationList');
    spyOn(GlobalMenuService.company, 'get');

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

});
