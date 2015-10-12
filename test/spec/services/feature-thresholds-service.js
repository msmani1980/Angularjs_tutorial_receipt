'use strict';

describe('Service: featureThresholdsService', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var featureThresholdsService;
  var httpBackend;
  beforeEach(inject(function(_featureThresholdsService_, $httpBackend) {
    featureThresholdsService = _featureThresholdsService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function() {
    expect(!!featureThresholdsService).toBe(true);
  });

  describe('getThresholdList', function() {
    it('should be accessible in the service', function() {
      expect(featureThresholdsService.getThresholdList).toBeDefined();
    });

    it('should make GET request to API', function () {
      var expectedURL = /api\/\d+\/thresholds$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      var fakeFeatureId = 3;
      featureThresholdsService.getThresholdList(fakeFeatureId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

  describe('getThreshold', function() {
    it('should be accessible in the service', function() {
      expect(featureThresholdsService.getThreshold).toBeDefined();
    });

    it('should make GET request to API', function () {
      var expectedURL = /api\/3\/thresholds\/1$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      var fakeFeatureId = 3;
      var fakeThresholdId = 1;
      featureThresholdsService.getThreshold(fakeFeatureId, fakeThresholdId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });
});
