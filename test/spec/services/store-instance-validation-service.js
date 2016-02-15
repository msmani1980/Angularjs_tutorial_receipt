'use strict';

describe('Service: storeInstanceValidationService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceValidationService,
    httpBackend;

  beforeEach(inject(function (_storeInstanceValidationService_, $httpBackend) {
    storeInstanceValidationService = _storeInstanceValidationService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('validateStoreInstance', function () {
    it('should make a PUT request when calling validateStoreInstance', function () {
      httpBackend.expectPUT(/api\/dispatch\/store-instances\/validate/).respond();
      storeInstanceValidationService.validateStoreInstance();
      httpBackend.flush();
    });
  });

});
