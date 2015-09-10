'use strict';

describe('Service: commissionDataService', function () {

  beforeEach(module('ts5App'));

  var recordsService,
    httpBackend;

  beforeEach(inject(function (_recordsService_, $httpBackend) {
    httpBackend = $httpBackend;
    recordsService = _recordsService_;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!recordsService).toBe(true);
  });

  describe('API calls', function () {
    describe('getCrewBaseTypes', function () {
      it('should be accessible in the service', function () {
        expect(!!recordsService.getCrewBaseTypes).toBe(true);
      });

      it('should make GET request to API', function () {
        var expectedURL = /records\/crew-base-types$/;
        httpBackend.expectGET(expectedURL).respond(200, []);
        recordsService.getCrewBaseTypes().then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
      });
    });

    describe('getCommissionPayableTypes', function () {
      it('should be accessible in the service', function () {
        expect(!!recordsService.getCommissionPayableTypes).toBe(true);
      });

      it('should make GET request to API', function () {
        var expectedURL = /records\/commission-payable-types$/;
        httpBackend.expectGET(expectedURL).respond(200, []);
        recordsService.getCommissionPayableTypes().then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
      });
    });

    describe('getDiscountTypes', function () {
      it('should be accessible in the service', function () {
        expect(!!recordsService.getDiscountTypes).toBe(true);
      });

      it('should make GET request to API', function () {
        var expectedURL = /records\/discount-types$/;
        httpBackend.expectGET(expectedURL).respond(200, []);
        recordsService.getDiscountTypes().then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
      });
    });

    describe('getStoreStatus', function () {
      it('should be accessible in the service', function () {
        expect(!!recordsService.getStoreStatus).toBe(true);
      });

      it('should make GET request to API', function () {
        var expectedURL = /records\/store-status$/;
        httpBackend.expectGET(expectedURL).respond(200, []);
        recordsService.getStoreStatus().then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
      });
    });

  });
});
