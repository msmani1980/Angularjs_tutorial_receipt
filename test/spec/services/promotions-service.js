'use strict';

describe('Service: promotionsService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var promotionsService;
  var httpBackend;
  beforeEach(inject(function (_promotionsService_, $httpBackend) {
    promotionsService = _promotionsService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getPromotion', function(){
    it('should make a GET request', function(){
      var expectedUri = /promotions\/\d+$/;
      var mockId = 123;
      httpBackend.expectGET(expectedUri).respond(200, {});
      promotionsService.getPromotion(mockId).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

  describe('savePromotion', function(){
    it('should make a PUT request', function(){
      var expectedUri = /promotions\/\d+$/;
      var mockId = 123;
      var mockPayload = {foo:'bars'};
      httpBackend.expectPUT(expectedUri).respond(200, {});
      promotionsService.savePromotion(mockId, mockPayload).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

  describe('createPromotion', function(){
    it('should make a POST request', function(){
      var expectedUri = /promotions$/;
      var mockPayload = {foo:'bars'};
      httpBackend.expectPOST(expectedUri).respond(200, {});
      promotionsService.createPromotion(mockPayload).then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

});
