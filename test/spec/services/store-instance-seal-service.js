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
      var sealTypeId = 4;
      var storeInstanceId = 66;
      var expectedURL = /store-instances\/\d+\/seals\/\d+$/;
      httpBackend.expectGET(expectedURL).respond(200, {});
      storeInstanceSealService.getStoreInstanceSeals(storeInstanceId,sealTypeId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

  describe('updateStoreInstanceSeal', function(){
    it('should make PUT request to API', function() {
      var expectedURL = /store-instances\/\d+\/seals\/\d+$/;
      var mockSealId = 17;
      var mockStoreInstanceId = 4;
      var mockPayload = {foo: 'barts'};
      httpBackend.expectPUT(expectedURL).respond(200, {});
      storeInstanceSealService.updateStoreInstanceSeal(mockSealId, mockStoreInstanceId, mockPayload).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

  describe('createStoreInstanceSeal', function(){
    it('should make POST request to API', function() {
      var expectedURL = /store-instances\/\d+\/seals\/\d+$/;
      var sealTypeId = 4;
      var storeInstanceId = 66;
      var mockPayload = {foo: 'barts'};
      httpBackend.expectPUT(expectedURL).respond(200, {});
      storeInstanceSealService.updateStoreInstanceSeal(sealTypeId, storeInstanceId, mockPayload).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    }); 
  });

  describe('deleteStoreInstanceSeal', function(){
    it('should make DELETE request to API', function() {
      var expectedURL = /store-instances\/\d+\/seals\/\d+$/;
      var sealId = 45;
      var storeInstanceId = 66;
      httpBackend.expectDELETE(expectedURL).respond(200, {});
      storeInstanceSealService.deleteStoreInstanceSeal(sealId, storeInstanceId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });
});
