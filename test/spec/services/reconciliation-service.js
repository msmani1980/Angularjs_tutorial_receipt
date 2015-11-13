'use strict';

fdescribe('Service: reconciliationService', function () {

  beforeEach(module('ts5App'));

  var reconciliationService;
  var httpBackend;

  beforeEach(inject(function (_reconciliationService_, $httpBackend) {
    reconciliationService = _reconciliationService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!reconciliationService).toBe(true);
  });

  it('should GET the stock totals', function () {
    var storeInstanceId = 'fakeStoreInstance';
    httpBackend.expectGET(/reconciliation\/stock-totals\?storeInstanceId/).respond(200, {});

    reconciliationService.getStockTotals(storeInstanceId).then(function (response) {
      expect(response).toBeDefined();
    });
    httpBackend.flush();
  });

});
