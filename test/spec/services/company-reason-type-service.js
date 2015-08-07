'use strict';

describe('Service: companyReasonTypeService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReasonTypeService;
  var httpBackend;
  beforeEach(inject(function (_companyReasonTypeService_, $injector) {
    companyReasonTypeService = _companyReasonTypeService_;
    httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist: companyReasonTypeService', function () {
    expect(!!companyReasonTypeService).toBe(true);
  });

  describe('API calls', function () {
    describe('getAll', function () {
      it('should be accessible in the service', function () {
        expect(companyReasonTypeService.getAll).toBeDefined();
      });
      beforeEach(function () {
        httpBackend.whenGET(/company-reason-types/).respond({done: true});
      });
      it('should make GET request to API', function () {
        companyReasonTypeService.getAll();
        httpBackend.expectGET(/company-reason-types/);
        httpBackend.flush();
      });
    });
  });

});
