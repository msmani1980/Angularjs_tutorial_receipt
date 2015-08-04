'use strict';

describe('Service: stockManagementService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var stockManagementService;
  var httpBackend;

  beforeEach(inject(function (_stockManagementService_, $httpBackend) {
    stockManagementService = _stockManagementService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!stockManagementService).toBe(true);
  });


  describe('API calls', function () {
    describe('getDeliveryNote', function () {
      it('should be accessible in the service', function () {
        expect(stockManagementService.getDeliveryNote).toBeDefined();
      });
      beforeEach(function () {
        httpBackend.whenGET(/stock-management\/delivery-notes/).respond({done: true});
      });
      it('should make GET request to API', function () {
        stockManagementService.getDeliveryNote(38);
        httpBackend.expectGET(/stock-management\/delivery-notes/);
        httpBackend.flush();
      });
    });
  });

});
