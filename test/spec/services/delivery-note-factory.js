'use strict';

describe('Service: deliveryNoteFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var deliveryNoteFactory;
  var stockManagementService;
  var stationsService;
  var GlobalMenuService;

  beforeEach(inject(function (_deliveryNoteFactory_, _stockManagementService_, _stationsService_, _GlobalMenuService_) {
    deliveryNoteFactory = _deliveryNoteFactory_;
    stockManagementService = _stockManagementService_;
    stationsService = _stationsService_;
    GlobalMenuService = _GlobalMenuService_;

    spyOn(stockManagementService, 'getDeliveryNote');
    spyOn(stationsService, 'getStationList');
    spyOn(GlobalMenuService.company, 'get');

  }));

  describe('stockManagementService calls', function(){
    it('should call getDeliveryNote', function(){
      var id = 123;
      deliveryNoteFactory.getDeliveryNote(id);
      expect(stockManagementService.getDeliveryNote).toHaveBeenCalledWith(id);
    });
  });

  describe('stationsService calls', function(){
    it('should call getStationList', function(){
      var cid = 432;
      deliveryNoteFactory.getStationList(cid);
      expect(stationsService.getStationList).toHaveBeenCalledWith(cid);
    });
  });

  describe('GlobalMenuService calls', function(){
    it('should call company.get', function(){
      deliveryNoteFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });

});
