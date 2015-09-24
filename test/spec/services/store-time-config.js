'use strict';

describe('Service: storeTimeConfig', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeTimeConfig;
  var httpBackend;
  beforeEach(inject(function(_storeTimeConfig_, $httpBackend) {
    storeTimeConfig = _storeTimeConfig_;
    httpBackend = $httpBackend;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTimeConfig', function() {
    it('should make GET request to API', function() {
      var expectedURL = /records\/seal-types$/;
      httpBackend.expectGET(expectedURL).respond(200, []);
      storeTimeConfig.getTimeConfig().then(function(response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });
});
