'use strict';

describe('Service: storeInstanceAmendService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceAmendService,
    $httpBackend;

  beforeEach(inject(function ($injector, _storeInstanceAmendService_) {
    storeInstanceAmendService = _storeInstanceAmendService_;

    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should exist', function () {
    expect(!!storeInstanceAmendService).toBe(true);
  });

  describe('API calls', function () {
    describe('movePostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!storeInstanceAmendService.movePostTrip).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenPUT(/api\/cash-bags\/1\/to\/2\/posttrip\/3/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        storeInstanceAmendService.movePostTrip(1, 2, 3);
        $httpBackend.expectPUT(/api\/cash-bags\/1\/to\/2\/posttrip\/3/);
        $httpBackend.flush();
      });
    });
    describe('addPostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!storeInstanceAmendService.addPostTrip).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenPOST(/api\/cash-bags\/1\/posttrip\/2/).respond({ done: true });
      });

      it('should POST data to cash bag API', function () {
        storeInstanceAmendService.addPostTrip(1, 2);
        $httpBackend.expectPOST(/api\/cash-bags\/1\/posttrip\/2/);
        $httpBackend.flush();
      });
    });
    describe('editPostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!storeInstanceAmendService.editPostTrip).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenPUT(/api\/cash-bags\/1\/edit\/2\/schedule\/3/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        storeInstanceAmendService.editPostTrip(1, 2, 3);
        $httpBackend.expectPUT(/api\/cash-bags\/1\/edit\/2\/schedule\/3/);
        $httpBackend.flush();
      });
    });
    describe('deletePostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!storeInstanceAmendService.deletePostTrip).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenDELETE(/api\/cash-bags\/1\/posttrip\/2/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        storeInstanceAmendService.deletePostTrip(1, 2);
        $httpBackend.whenDELETE(/api\/cash-bags\/1\/posttrip\/2/);
        $httpBackend.flush();
      });
    });
    describe('getPostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!storeInstanceAmendService.getPostTrips).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenGET(/api\/cash-bags\/1/).respond({ done: true });
      });

      it('should GET data to cash bag API', function () {
        storeInstanceAmendService.getPostTrips(1);
        $httpBackend.whenGET(/api\/cash-bags\/1/);
        $httpBackend.flush();
      });
    });
  });

});
