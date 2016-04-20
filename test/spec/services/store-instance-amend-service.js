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
        $httpBackend.whenPUT(/rsvr\/api\/cash-bags\/1\/to\/2\/posttrip\/3/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        storeInstanceAmendService.movePostTrip(1, 2, 3);
        $httpBackend.expectPUT(/rsvr\/api\/cash-bags\/1\/to\/2\/posttrip\/3/);
        $httpBackend.flush();
      });
    });
  });

});
