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

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getStoreInstancesList', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceService.getStoreInstancesList().then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('getStoreInstance', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+$/;
      var fakeId = 38;
      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceService.getStoreInstance(fakeId).then(function (response) {
        expect(response).toBeDefined();
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
      httpBackend.expectPOST(expectedURL).respond(200, {});

      storeInstanceService.createStoreInstance(fakePayload).then(function (response) {
        expect(response).toBeDefined();
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
      httpBackend.expectPUT(expectedURL).respond(200, {});

      storeInstanceService.updateStoreInstance(fakeId, fakePayload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('deleteStoreInstance', function () {
    it('should make DELETE request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+$/;
      var fakeId = 12;
      httpBackend.expectDELETE(expectedURL).respond(200, {});
      storeInstanceService.deleteStoreInstance(fakeId).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('getStoreInstanceMenuItems', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/menu-items/;
      var fakeId = 12;
      var payload = {
        fakeKey: 'fakeValue'
      };

      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceService.getStoreInstanceMenuItems(fakeId, payload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('getStoreInstanceItemList', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items/;
      var fakeId = 12;
      var payload = {
        fakeKey: 'fakeValue'
      };

      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceService.getStoreInstanceItemList(fakeId, payload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('getStoreInstanceItem', function () {
    it('should make GET request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items\/\d+$/;
      var fakeStoreId = 38;
      var fakeItemId = 1;
      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceService.getStoreInstanceItem(fakeStoreId, fakeItemId).then(function (response) {
        expect(response).toBeDefined();
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

      httpBackend.expectPUT(expectedURL).respond(200, {});
      storeInstanceService.updateStoreInstanceItem(fakeStoreId, fakeItemId, payload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('updateStoreInstanceItems', function () {
    it('should make PUT request to API', function () {
      var expectedURL = /dispatch\/store-instance\/\d+\/bulkitems$/;
      var fakeStoreId = 38;
      var payload = {
        fakeKey: 'fakeValue'
      };

      httpBackend.expectPUT(expectedURL).respond(200, {});
      storeInstanceService.updateStoreInstanceItems(fakeStoreId, payload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('updateStoreInstanceItemBulk', function () {
    it('should make PUT request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items\/bulk$/;
      var fakeStoreId = 38;
      var payload = {
        fakeKey: 'fakeValue'
      };

      httpBackend.expectPOST(expectedURL).respond(200, {});
      storeInstanceService.updateStoreInstanceItemsBulk(fakeStoreId, payload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('deleteStoreInstanceItem', function () {
    it('should make DELETE request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/items\/\d+$/;
      var fakeStoreId = 38;
      var fakeItemId = 1;

      httpBackend.expectDELETE(expectedURL).respond(200, {});
      storeInstanceService.deleteStoreInstanceItem(fakeStoreId, fakeItemId).then(function (response) {
        expect(response).toBeDefined();
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
      httpBackend.expectPOST(expectedURL).respond(200, {});
      storeInstanceService.createStoreInstanceItem(fakeStoreId, payload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('createStoreInstanceItems', function () {
    it('should make POST request to API', function () {
      var expectedURL = /dispatch\/store-instance\/\d+\/bulkitems$/;
      var fakeStoreId = 38;
      var payload = {
        fakeKey: 'fakeValue'
      };
      httpBackend.expectPOST(expectedURL).respond(200, {});
      storeInstanceService.createStoreInstanceItems(fakeStoreId, payload).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

  describe('updateStoreInstanceStatusForceReconcile', function () {
	    it('should make PUT request to API', function () {
	      var expectedURL = /dispatch\/store-instances\/\d+\/status\/\d+$/;
	      var fakeStoreId = 10;
	      var fakeStatusId = 20;
	      httpBackend.expectPUT(expectedURL).respond(200, {});
	      storeInstanceService.updateStoreInstanceStatusForceReconcile(fakeStoreId, fakeStatusId).then(function (response) {
	        expect(response).toBeDefined();
	      });

	      httpBackend.flush();
	    });
	  });


  describe('updateStoreInstanceStatusUndispatch', function () {
	    it('should make PUT request to API', function () {
	      var expectedURL = /dispatch\/store-instances\/\d+\/status\/\d+$/;
	      var fakeStoreId = 10;
	      var fakeStatusId = 20;
	      httpBackend.expectPUT(expectedURL).respond(200, {});
	      storeInstanceService.updateStoreInstanceStatusUndispatch(fakeStoreId, fakeStatusId).then(function (response) {
	        expect(response).toBeDefined();
	      });

	      httpBackend.flush();
	    });
	  });


  describe('updateStoreInstanceStatus', function () {
    it('should make PUT request to API', function () {
      var expectedURL = /dispatch\/store-instances\/\d+\/status\/\d+$/;
      var fakeStoreId = 10;
      var fakeStatusId = 20;
      httpBackend.expectPUT(expectedURL).respond(200, {});
      storeInstanceService.updateStoreInstanceStatus(fakeStoreId, fakeStatusId).then(function (response) {
        expect(response).toBeDefined();
      });

    httpBackend.flush();
    });
  });



  describe('getStoreInstanceCalculatedInbounds', function() {
    it('should make GET request to API', function() {
      var expectedURL = /store-instances\/\d+\/calculated-inbounds$/;
      var storeInstanceId = 66;
      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceService.getStoreInstanceCalculatedInbounds(storeInstanceId, {}).then(function (response) {
        expect(response).toBeDefined();
      });

      httpBackend.flush();
    });
  });

});
