'use strict';

describe('Service: sealColorsService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var sealColorsService;
  var httpBackend;
  beforeEach(inject(function (_sealColorsService_, $httpBackend) {
    sealColorsService = _sealColorsService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getSealColors', function () {
    it('should make GET request to API', function () {
      var expectedURL = /seal\/colors$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      sealColorsService.getSealColors().then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

});
