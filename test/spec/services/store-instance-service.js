'use strict';

describe('Service: storeInstanceService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceService;
  var httpBackend;
  beforeEach(inject(function (_storeInstanceService_, $httpBackend) {
    storeInstanceService = _storeInstanceService_;
    httpBackend = $httpBackend;
  }));

  describe('getStoreInstancesList', function () {
    it('should make GET request to API', function () {
      httpBackend.whenGET(/dispatch\/store-instances/).respond({done: true});
      storeInstanceService.getStoreInstancesList();
      httpBackend.expectGET(/dispatch\/store-instances/);
      httpBackend.flush();
    });
  });
  describe('getStoreInstance', function () {
    it('should make GET request to API', function () {
      httpBackend.whenGET(/dispatch\/store-instances/).respond({done: true});
      storeInstanceService.getStoreInstance(38);
      httpBackend.expectGET(/dispatch\/store-instances/);
      httpBackend.flush();
    });
  });
  describe('createStoreInstance', function(){
    it('should make POST request to API', function () {
      httpBackend.whenPOST(/dispatch\/store-instances/).respond({done: true});
      storeInstanceService.createStoreInstance({});
      httpBackend.expectPOST(/dispatch\/store-instances/);
      httpBackend.flush();
    });
  });
  describe('updateStoreInstance', function(){
    it('should make PUT request to API', function () {
      httpBackend.whenPUT(/dispatch\/store-instances/).respond({done: true});
      storeInstanceService.updateStoreInstance({});
      httpBackend.expectPUT(/dispatch\/store-instances/);
      httpBackend.flush();
    });
  });
  describe('deleteStoreInstance', function(){
    it('should make DELETE request to API', function () {
      httpBackend.whenDELETE(/dispatch\/store-instances/).respond({done: true});
      storeInstanceService.deleteStoreInstance(12);
      httpBackend.expectDELETE(/dispatch\/store-instances/);
      httpBackend.flush();
    });
  });
});
