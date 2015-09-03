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
      var expectedURL = /dispatch\/store-instances$/;
      httpBackend.expectGET(expectedURL).respond(200, {success: true});
      storeInstanceService.getStoreInstancesList().then(function (response) {
        expect(response.success).toBe(true);
      });
      httpBackend.flush();
    });
  });

  describe('getStoreInstance', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+$/;
      var fakeId = 38;
      httpBackend.expectGET(expectedURL).respond(200, {id: fakeId});
      storeInstanceService.getStoreInstance(fakeId).then(function (response) {
        expect(response.id).toBe(fakeId);
      });
      httpBackend.flush();
    });
  });

  describe('createStoreInstance', function () {
    it('should make POST request to API', function () {
      var expectedURL = /dispatch\/store-instances$/;
      var fakePayload = {
        key: 'value'
      };
      httpBackend.expectPOST(expectedURL).respond(200, angular.extend({}, fakePayload, {id: 'newFakeId'}));

      storeInstanceService.createStoreInstance(fakePayload).then(function (response) {
        expect(response.id).toBe('newFakeId');
        expect(response.key).toBe(fakePayload.key);
      });

      httpBackend.flush();
    });
  });

  describe('updateStoreInstance', function () {
    it('should make PUT request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+$/;
      var fakeId = 38;
      var fakePayload = {
        id: fakeId,
        key: 'value'
      };
      httpBackend.expectPUT(expectedURL).respond(200, fakePayload);

      storeInstanceService.updateStoreInstance(fakeId, fakePayload).then(function (response) {
        expect(response.id).toBe(fakePayload.id);
        expect(response.key).toBe(fakePayload.key);
      });
      httpBackend.flush();
    });
  });

  describe('deleteStoreInstance', function () {
    it('should make DELETE request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+$/;
      var fakeId = 12;
      httpBackend.expectDELETE(expectedURL).respond(200, {id: fakeId});
      storeInstanceService.deleteStoreInstance(fakeId).then(function (response) {
        expect(response.id).toBe(fakeId);
      });
      httpBackend.flush();
    });
  });

  describe('getStoreInstanceItems', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items$/;
      var fakeId = 12;
      httpBackend.expectGET(expectedURL).respond(200, {id: fakeId});
      storeInstanceService.getStoreInstanceItems(fakeId).then(function (response) {
        expect(response.id).toBe(fakeId);
      });
      httpBackend.flush();
    });
  });
});
