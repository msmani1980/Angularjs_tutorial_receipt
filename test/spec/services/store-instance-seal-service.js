'use strict';

describe('Service: storeInstanceSealService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceSealService;
  var httpBackend;
  beforeEach(inject(function (_storeInstanceSealService_, $httpBackend) {
    storeInstanceSealService = _storeInstanceSealService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getStoreInstanceSeals', function () {
    it('should make GET request to API', function () {
      var expectedURL = /store-instances\/\d+\/seals$/;
      var fakeId = 4;
      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceSealService.getStoreInstanceSeals(fakeId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });
});
