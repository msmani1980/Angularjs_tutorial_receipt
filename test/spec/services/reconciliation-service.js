'use strict';

describe('Service: reconciliationService', function () {

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

  it('should GET the promotion totals', function () {
    var storeInstanceId = 'fakeStoreInstance';
    httpBackend.expectGET(/reconciliation\/promotion-totals\?storeInstanceId/).respond(200, {});

    reconciliationService.getPromotionTotals(storeInstanceId).then(function (response) {
      expect(response).toBeDefined();
    });
    httpBackend.flush();
  });

  describe('revenue totals', function () {
    it('should getCHCashBagRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      httpBackend.expectGET(/api\/reconciliation\/revenue-totals\/ch-cashbags\?storeInstanceId/).respond(200, {});

      reconciliationService.getCHCashBagRevenue(storeInstanceId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });

    it('should getCHCreditCardRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      httpBackend.expectGET(/api\/reconciliation\/revenue-totals\/ch-credit-cards\?storeInstanceId/).respond(200, {});

      reconciliationService.getCHCreditCardRevenue(storeInstanceId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });

    it('should getCHDiscountRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      httpBackend.expectGET(/api\/reconciliation\/revenue-totals\/ch-discounts\?storeInstanceId/).respond(200, {});

      reconciliationService.getCHDiscountRevenue(storeInstanceId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });

    it('should getEPOSCashBagRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      httpBackend.expectGET(/api\/reconciliation\/revenue-totals\/epos-cashbags\?storeInstanceId/).respond(200, {});

      reconciliationService.getEPOSCashBagRevenue(storeInstanceId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });

    it('should getEPOSCreditCardRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      httpBackend.expectGET(/api\/reconciliation\/revenue-totals\/epos-credit-cards\?storeInstanceId/).respond(200, {});

      reconciliationService.getEPOSCreditCardRevenue(storeInstanceId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });

    it('should getEPOSDiscountRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      httpBackend.expectGET(/api\/reconciliation\/revenue-totals\/epos-discounts\?storeInstanceId/).respond(200, {});

      reconciliationService.getEPOSDiscountRevenue(storeInstanceId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });

    it('should fetch reconciliation pre-check devices', function () {
      httpBackend.expectGET(/api\/reconciliation\/pre-check\/123\/devices/).respond(200, {});
      reconciliationService.getReconciliationPrecheckDevices({storeInstanceId: 123}).then(function (dataFromAPI) {
        expect(dataFromAPI).toBeDefined();
      });
      httpBackend.flush();

    });

    it('should fetch reconciliation pre-check schedules', function () {
      httpBackend.expectGET(/api\/reconciliation\/pre-check\/123\/schedules/).respond(200, {});
      reconciliationService.getReconciliationPrecheckSchedules({storeInstanceId: 123}).then(function (dataFromAPI) {
        expect(dataFromAPI).toBeDefined();
      });
      httpBackend.flush();
    });

    it('should fetch reconciliation pre-check cashbags', function () {
      httpBackend.expectGET(/api\/reconciliation\/pre-check\/123\/cashbags/).respond(200, {});
      reconciliationService.getReconciliationPrecheckCashbags({storeInstanceId: 123}).then(function (dataFromAPI) {
        expect(dataFromAPI).toBeDefined();
      });
      httpBackend.flush();
    });

  });

});
