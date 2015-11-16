'use strict';

describe('Service: reconciliationService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/reconciliation-precheck-devices.json',
    'served/reconciliation-precheck-schedules.json',
    'served/reconciliation-precheck-cashbags.json'
  ));

  // instantiate service
  var reconciliationService;
  var $httpBackend;
  var reconciliationPrecheckDevicesRequestHandler;
  var reconciliationPrecheckSchedulesRequestHandler;
  var reconciliationPrecheckCashbagsRequestHandler;
  var precheckDevicesJSON;
  var precheckSchedulesJSON;
  var precheckCashbagsJSON;

  beforeEach(inject(function (_reconciliationService_, $injector) {
    inject(function (_servedReconciliationPrecheckDevices_, _servedReconciliationPrecheckSchedules_, _servedReconciliationPrecheckCashbags_) {
      precheckDevicesJSON = _servedReconciliationPrecheckDevices_;
      precheckSchedulesJSON = _servedReconciliationPrecheckSchedules_;
      precheckCashbagsJSON = _servedReconciliationPrecheckCashbags_;
    });

    reconciliationService = _reconciliationService_;

    $httpBackend = $injector.get('$httpBackend');

    reconciliationPrecheckDevicesRequestHandler = $httpBackend.whenGET(/api\/reconciliation\/pre-check\/123\/devices/).respond(precheckDevicesJSON);
    reconciliationPrecheckSchedulesRequestHandler = $httpBackend.whenGET(/api\/reconciliation\/pre-check\/123\/schedules/).respond(precheckSchedulesJSON);
    reconciliationPrecheckCashbagsRequestHandler = $httpBackend.whenGET(/api\/reconciliation\/pre-check\/123\/cashbags/).respond(precheckCashbagsJSON);
  }));

  afterEach(function () {
    //$httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!reconciliationService).toBe(true);
  });

  describe('API calls', function () {
    afterEach(function () {
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch reconciliation pre-check devices', function () {
      reconciliationService.getReconciliationPrecheckDevices({storeInstanceId: 123}).then(function (dataFromAPI) {
        expect(dataFromAPI.storeInstanceId).toEqual(123);
      });
    });

    it('should fetch reconciliation pre-check schedules', function () {
      reconciliationService.getReconciliationPrecheckSchedules({storeInstanceId: 123}).then(function (dataFromAPI) {
        expect(dataFromAPI.storeInstanceId).toEqual(123);
      });
    });

    it('should fetch reconciliation pre-check cashbags', function () {
      reconciliationService.getReconciliationPrecheckCashbags({storeInstanceId: 123}).then(function (dataFromAPI) {
        expect(dataFromAPI.storeInstanceId).toEqual(123);
      });
    });
  });

});
