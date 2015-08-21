'use strict';

describe('Service: stockAdjustmentsService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var stockAdjustmentsService;
  var $httpBackend;
  beforeEach(inject(function ($injector) {
    stockAdjustmentsService = $injector.get('stockAdjustmentsService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should do something', function () {
    expect(!!stockAdjustmentsService).toBe(true);
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('API calls', function () {
    describe('adjustStock', function () {
      it('should be accessible in the service', function () {
        expect(stockAdjustmentsService.adjustStock).toBeDefined();
      });

      beforeEach(function () {
        $httpBackend.whenPUT(/stock-management\/stock-adjustments/).respond({done: true});
      });
      it('should POST data to item import API', function () {
        stockAdjustmentsService.adjustStock({});
        $httpBackend.expectPUT(/stock-management\/stock-adjustments/);
        $httpBackend.flush();
      });
    });
  });

});
