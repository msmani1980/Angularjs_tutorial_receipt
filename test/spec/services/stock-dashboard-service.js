'use strict';

describe('Service: stockDashboardService', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var stockDashboardService;
  var httpBackend;

  beforeEach(inject(function(_stockDashboardService_, $httpBackend) {
    stockDashboardService = _stockDashboardService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function() {
    expect(!!stockDashboardService).toBe(true);
  });

  describe('API calls', function() {
    describe('getStockDashboardItems', function() {
      it('should be accessible in the service', function() {
        expect(stockDashboardService.getStockDashboardItems).toBeDefined();
      });
      beforeEach(function() {
        httpBackend.whenGET(/stock-management\/dashboard/).respond({
          done: true
        });
      });
      it('should make GET request to API', function() {
        stockDashboardService.getStockDashboardItems();
        httpBackend.expectGET(/stock-management\/dashboard/);
        httpBackend.flush();
      });
    });
  });

});
