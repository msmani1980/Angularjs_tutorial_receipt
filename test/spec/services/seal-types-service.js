'use strict';

describe('Service: sealTypesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var sealTypesService;
  var httpBackend;
  beforeEach(inject(function (_sealTypesService_, $httpBackend) {
    sealTypesService = _sealTypesService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getSealTypes', function () {
    it('should make GET request to API', function () {
      var expectedURL = /records\/seal-types$/;
      httpBackend.expectGET(expectedURL).respond(200, []);
      sealTypesService.getSealTypes().then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });
});
