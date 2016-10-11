'use strict';

describe('Service: promotionCategoriesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var promotionCategoriesService;
  var $httpBackend;

  beforeEach(inject(function (_promotionCategoriesService_, $injector) {
    promotionCategoriesService = _promotionCategoriesService_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exists', function () {
    expect(!!promotionCategoriesService).toBe(true);
  });

  describe('API requests', function () {
    it('should GET promotion category list', function () {
      $httpBackend.expectGET(/promotion-categories/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCategoriesService.getPromotionCategories({}).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should GET promotion category by id', function () {
      $httpBackend.expectGET(/promotion-categories\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCategoriesService.getPromotionCategory(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should POST a new promotion category record', function () {
      $httpBackend.expectPOST(/promotion-categories/).respond(200, { fakeResponseKey: 'POST' });

      promotionCategoriesService.createPromotionCategory().then(function (response) {
        expect(response.fakeResponseKey).toBe('POST');
      });

      $httpBackend.flush();
    });

    it('should PUT an existing promotion category by id', function () {
      $httpBackend.expectPUT(/promotion-categories\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCategoriesService.updatePromotionCategory(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should DELETE an existing promotion category by id', function () {
      $httpBackend.expectDELETE(/promotion-categories\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCategoriesService.deletePromotionCategory(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

  });
});
