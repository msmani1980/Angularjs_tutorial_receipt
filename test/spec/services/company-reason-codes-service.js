'use strict';

describe('Service: companyReasonCodesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReasonCodesService;
  var httpBackend;
  beforeEach(inject(function (_companyReasonCodesService_, $injector) {
    companyReasonCodesService = _companyReasonCodesService_;
    httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist: companyReasonCodesService', function () {
    expect(!!companyReasonCodesService).toBe(true);
  });

  describe('API calls', function () {
    describe('getAll', function () {
      it('should be accessible in the service', function () {
        expect(companyReasonCodesService.getAll).toBeDefined();
      });
      beforeEach(function () {
        httpBackend.whenGET(/company-reason-codes/).respond({done: true});
      });
      it('should make GET request to API', function () {
        companyReasonCodesService.getAll();
        httpBackend.expectGET(/company-reason-codes/);
        httpBackend.flush();
      });
    });
  });

});
