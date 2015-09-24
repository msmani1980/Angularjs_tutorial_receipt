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

  it('should exist', function() {
    expect(!!storeTimeConfig).toBe(true);
  });

  describe('getTimeConfig', function() {
    it('should be accessible in the service', function() {
      expect(storeTimeConfig.getTimeConfig).toBeDefined();
    });

    beforeEach(function() {
      httpBackend.whenGET(/api\/companies\/time-configuration/).respond({
        done: true
      });
    });

    it('should make GET request to API', function() {
      storeTimeConfig.getTimeConfig();
      httpBackend.expectGET(/api\/companies\/time-configuration/);
      httpBackend.flush();
    });

  });
});
