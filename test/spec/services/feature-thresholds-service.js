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
      var expectedURL = /api\/feature\/STOREDISPATCH\/thresholds$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      featureThresholdsService.getThresholdList('STOREDISPATCH').then(function (response) {
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
      var expectedURL = /api\/feature\/FAKECODE\/thresholds\/1$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      featureThresholdsService.getThreshold('FAKECODE', 1).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });
});
