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
      httpBackend.whenGET(/companies\/stores/).respond({done: true});
      storesService.getStoresList();
      httpBackend.expectGET(/companies\/stores/);
      httpBackend.flush();
    });
  });

});
