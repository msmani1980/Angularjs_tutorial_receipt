'use strict';

describe('Service: stockManagementStationItemsService', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var stockManagementStationItemsService;
  var httpBackend;

  beforeEach(inject(function(_stockManagementStationItemsService_, $httpBackend) {
    stockManagementStationItemsService = _stockManagementStationItemsService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function() {
    expect(!!stockManagementStationItemsService).toBe(true);
  });

  describe('API calls', function() {
    describe('getStockManagementStationItems', function() {
      it('should be accessible in the service', function() {
        expect(stockManagementStationItemsService.getStockManagementStationItems).toBeDefined();
      });
      beforeEach(function() {
        httpBackend.whenGET(/stock-management\/station-items/).respond({
          done: true
        });
      });
      it('should make GET request to API', function() {
        stockManagementStationItemsService.getStockManagementStationItems();
        httpBackend.expectGET(/stock-management\/station-items/);
        httpBackend.flush();
      });
    });
  });

});
