'use strict';

describe('Service: deliveryNoteFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var deliveryNoteFactory;
  var stockManagementService;
  var stationsService;
  beforeEach(inject(function (_deliveryNoteFactory_, _stockManagementService_, _stationsService_) {
    deliveryNoteFactory = _deliveryNoteFactory_;
    stockManagementService = _stockManagementService_;
    stationsService = _stationsService_;

    spyOn(stockManagementService, 'getDeliveryNote');
    spyOn(stationsService, 'getStationList');

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
      var id = 432;
      deliveryNoteFactory.getStationList(id);
      expect(stationsService.getStationList).toHaveBeenCalledWith(id);
    });
  });

});
