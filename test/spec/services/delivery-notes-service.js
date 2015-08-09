'use strict';

describe('Service: deliveryNotesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var deliveryNotesService;
  var httpBackend;

  beforeEach(inject(function (_deliveryNotesService_, $httpBackend) {
    deliveryNotesService = _deliveryNotesService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!deliveryNotesService).toBe(true);
  });


  describe('API calls', function () {
    describe('getDeliveryNote', function () {
      it('should be accessible in the service', function () {
        expect(deliveryNotesService.getDeliveryNote).toBeDefined();
      });
      beforeEach(function () {
        httpBackend.whenGET(/stock-management\/delivery-notes/).respond({done: true});
      });
      it('should make GET request to API', function () {
        deliveryNotesService.getDeliveryNote(38);
        httpBackend.expectGET(/stock-management\/delivery-notes/);
        httpBackend.flush();
      });
    });
  });

});
