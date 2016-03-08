'use strict';

describe('Service: carrierInstancesService', function () {

  beforeEach(module('ts5App'));

  var carrierInstancesService,
    $httpBackend;

  beforeEach(inject(function (_carrierInstancesService_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    carrierInstancesService = _carrierInstancesService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exists', function () {
    expect(!!carrierInstancesService).toBe(true);
  });

  describe('API requests', function () {

    it('should GET carrier instances', function () {
      $httpBackend.expectGET(/carrier-instances/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      carrierInstancesService.getCarrierInstances().then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should PUT a carrier instance', function () {
      var carrierInstsanceId = 123;
      $httpBackend.expectPUT(/carrier-instances\/\d+/).respond(200, { fakeResponseKey: carrierInstsanceId });

      carrierInstancesService.updateCarrierInstance(carrierInstsanceId).then(function (response) {
        expect(response.fakeResponseKey).toBe(carrierInstsanceId);
      });

      $httpBackend.flush();
    });


  });

});
