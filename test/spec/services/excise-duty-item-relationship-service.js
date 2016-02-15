'use strict';

describe('Service: exciseDutyRelationshipService', function () {

  beforeEach(module('ts5App'));

  var exciseDutyService,
    $httpBackend;

  beforeEach(inject(function (_exciseDutyService_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    exciseDutyService = _exciseDutyService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exists', function () {
    expect(!!exciseDutyService).toBe(true);
  });

  describe('API requests', function () {

    it('should GET excise duty list', function () {
      $httpBackend.expectGET(/excise-duty/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      exciseDutyService.getExciseDutyList().then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should GET a single excise duty', function () {
      var exciseDutyId = 123;
      $httpBackend.expectGET(/excise-duty\/\d+/).respond(200, { fakeResponseKey: exciseDutyId });

      exciseDutyService.getExciseDuty(exciseDutyId).then(function (response) {
        expect(response.fakeResponseKey).toBe(exciseDutyId);
      });

      $httpBackend.flush();
    });

    it('should POST an excise duty record', function () {
      $httpBackend.expectPOST(/excise-duty/).respond(201, { fakeResponseKey: 'POST' });

      exciseDutyService.createExciseDuty().then(function (response) {
        expect(response.fakeResponseKey).toBe('POST');
      });

      $httpBackend.flush();
    });

    it('should PUT an excise duty record', function () {
      var exciseDutyId = 123;
      $httpBackend.expectPUT(/excise-duty\/\d+/).respond(200, { fakeResponseKey: exciseDutyId });

      exciseDutyService.updateExciseDuty(exciseDutyId).then(function (response) {
        expect(response.fakeResponseKey).toBe(exciseDutyId);
      });

      $httpBackend.flush();
    });

    it('should delete an excise duty record', function () {
      var exciseDutyId = 123;
      $httpBackend.expectDELETE(/excise-duty/).respond(200, { fakeResponseKey: exciseDutyId });

      exciseDutyService.deleteExciseDuty(exciseDutyId).then(function (response) {
        expect(response.fakeResponseKey).toBe(exciseDutyId);
      });

      $httpBackend.flush();
    });

  });

});
