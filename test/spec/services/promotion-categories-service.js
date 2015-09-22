'use strict';

describe('Service: promotionCategoriesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var promotionCategoriesService;
  var httpBackend;
  beforeEach(inject(function (_promotionCategoriesService_, $httpBackend) {
    promotionCategoriesService = _promotionCategoriesService_;
    httpBackend = $httpBackend;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getPromotionCategories', function(){
    it('should make a GET request', function(){
      var expectUri = /promotion-categories$/;
      httpBackend.expectGET(expectUri).respond(200, []);
      promotionCategoriesService.getPromotionCategories().then(function (response) {
        expect(response).toBeDefined();
      });
      httpBackend.flush();
    });
  });

});
