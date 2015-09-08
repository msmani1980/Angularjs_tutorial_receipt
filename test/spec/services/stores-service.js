'use strict';

describe('Service: storesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storesService;
  var httpBackend;
  beforeEach(inject(function (_storesService_, $httpBackend) {
    storesService = _storesService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getStoresList', function () {
    it('should make a GET request when calling getStoresList', function () {
      httpBackend.expectGET(/companies\/stores/).respond({done: true});
      storesService.getStoresList();
      httpBackend.flush();
    });
  });

  describe('getStore', function () {
    it('should make a GET request when calling getStore', function () {
      var fakeId = 1;
      httpBackend.expectGET(/companies\/stores\/\d+$/).respond({done: true, id: fakeId});
      storesService.getStore(fakeId).then(function (response) {
        expect(response.id).toBe(fakeId);
      });
      httpBackend.flush();
    });
  });

});
