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

  describe('getStoreInstanceMenuItems', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/menu-items$/;
      var fakeId = 12;
      var payload = {
        fakeKey: 'fakeValue'
      };
      var mockResponse = angular.extend({}, {
        id: fakeId
      }, payload);
      httpBackend.expectGET(expectedURL).respond(200, mockResponse);
      storeInstanceService.getStoreInstanceMenuItems(fakeId, payload).then(function (response) {
        expect(response.id).toBe(fakeId);
        expect(response.fakeKey).toBe('fakeValue');
      });
      httpBackend.flush();
    });
  });

  describe('getStoreInstanceItemList', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items$/;
      var fakeId = 12;
      var payload = {
        fakeKey: 'fakeValue'
      };
      var mockResponse = angular.extend({}, {
        id: fakeId
      }, payload);
      httpBackend.expectGET(expectedURL).respond(200, mockResponse);
      storeInstanceService.getStoreInstanceItemList(fakeId, payload).then(function (response) {
        expect(response.id).toBe(fakeId);
        expect(response.fakeKey).toBe('fakeValue');
      });
      httpBackend.flush();
    });
  });

  describe('getStoreInstanceItem', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items\/\d+$/;
      var fakeStoreId = 38;
      var fakeItemId = 1;
      httpBackend.expectGET(expectedURL).respond(200, {
        id: fakeStoreId,
        itemId: fakeItemId
      });
      storeInstanceService.getStoreInstanceItem(fakeStoreId, fakeItemId).then(function (response) {
        expect(response.id).toBe(fakeStoreId);
        expect(response.itemId).toBe(fakeItemId);
      });
      httpBackend.flush();
    });
  });

  describe('updateStoreInstanceItem', function () {
    it('should make PUT request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items\/\d+$/;
      var fakeStoreId = 38;
      var fakeItemId = 1;
      var payload = {
        fakeKey: 'fakeValue'
      };
      var mockResponse = angular.extend({}, {
        id: fakeStoreId,
        itemId: fakeItemId
      }, payload);

      httpBackend.expectPUT(expectedURL).respond(200, mockResponse);
      storeInstanceService.updateStoreInstanceItem(fakeStoreId, fakeItemId, payload).then(function (response) {
        expect(response.id).toBe(fakeStoreId);
        expect(response.itemId).toBe(fakeItemId);
        expect(response.fakeKey).toBe(payload.fakeKey);
      });
      httpBackend.flush();
    });
  });

  describe('deleteStoreInstanceItem', function () {
    it('should make DELETE request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items\/\d+$/;
      var fakeStoreId = 38;
      var fakeItemId = 1;
      var mockResponse = {
        id: fakeStoreId,
        itemId: fakeItemId
      };

      httpBackend.expectDELETE(expectedURL).respond(200, mockResponse);
      storeInstanceService.deleteStoreInstanceItem(fakeStoreId, fakeItemId).then(function (response) {
        expect(response.id).toBe(fakeStoreId);
        expect(response.itemId).toBe(fakeItemId);
      });
      httpBackend.flush();
    });
  });

  describe('createStoreInstanceItem', function () {
    it('should make POST request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items$/;
      var fakeStoreId = 38;
      var payload = {
        fakeKey: 'fakeValue'
      };
      var mockResponse = angular.extend({}, {
        id: fakeStoreId
      }, payload);

      httpBackend.expectPOST(expectedURL).respond(200, mockResponse);
      storeInstanceService.createStoreInstanceItem(fakeStoreId, payload).then(function (response) {
        expect(response.id).toBe(fakeStoreId);
        expect(response.fakeKey).toBe(payload.fakeKey);
      });
      httpBackend.flush();
    });
  });

});
