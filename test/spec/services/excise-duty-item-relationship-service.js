'use strict';

describe('Service: exciseDutyRelationshipService', function () {

  beforeEach(module('ts5App'));

  var exciseDutyRelationshipService,
    $httpBackend;

  beforeEach(inject(function (_exciseDutyRelationshipService_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    exciseDutyRelationshipService = _exciseDutyRelationshipService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exists', function () {
    expect(!!exciseDutyRelationshipService).toBe(true);
  });

  describe('API requests', function () {

    it('should GET item excise duty relationship list', function () {
      $httpBackend.expectGET(/item-excise-duty/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      exciseDutyRelationshipService.getRelationshipList().then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should GET a single item excise duty relationship', function () {
      var recordId = 123;
      $httpBackend.expectGET(/item-excise-duty\/\d+/).respond(200, { fakeResponseKey: recordId });

      exciseDutyRelationshipService.getRelationship(recordId).then(function (response) {
        expect(response.fakeResponseKey).toBe(recordId);
      });

      $httpBackend.flush();
    });

    it('should POST an item excise duty relationship record', function () {
      $httpBackend.expectPOST(/item-excise-duty/).respond(201, { fakeResponseKey: 'POST' });

      exciseDutyRelationshipService.createRelationship().then(function (response) {
        expect(response.fakeResponseKey).toBe('POST');
      });

      $httpBackend.flush();
    });

    it('should PUT an item excise duty relationship record', function () {
      var recordId = 123;
      $httpBackend.expectPUT(/item-excise-duty\/\d+/).respond(200, { fakeResponseKey: recordId });

      exciseDutyRelationshipService.updateRelationship(recordId).then(function (response) {
        expect(response.fakeResponseKey).toBe(recordId);
      });

      $httpBackend.flush();
    });

    it('should delete an item excise duty relationship record', function () {
      var recordId = 123;
      $httpBackend.expectDELETE(/item-excise-duty/).respond(200, { fakeResponseKey: recordId });

      exciseDutyRelationshipService.deleteRelationship(recordId).then(function (response) {
        expect(response.fakeResponseKey).toBe(recordId);
      });

      $httpBackend.flush();
    });

  });

});
