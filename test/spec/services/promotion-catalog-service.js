'use strict';

describe('Service: promotionCatalogService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var promotionCatalogService;
  var $httpBackend;

  beforeEach(inject(function (_promotionCatalogService_, $injector) {
    promotionCatalogService = _promotionCatalogService_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exists', function () {
    expect(!!promotionCatalogService).toBe(true);
  });

  describe('API requests', function () {
    it('should GET promotion catalog list', function () {
      $httpBackend.expectGET(/company-promotion-catalogs/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.getPromotionCatalogList({}).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should GET promotion catalog by id', function () {
      $httpBackend.expectGET(/company-promotion-catalogs\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.getPromotionCatalog(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should POST a new promotion catalog record', function () {
      $httpBackend.expectPOST(/company-promotion-catalogs/).respond(200, { fakeResponseKey: 'POST' });

      promotionCatalogService.createPromotionCatalog().then(function (response) {
        expect(response.fakeResponseKey).toBe('POST');
      });

      $httpBackend.flush();
    });

    it('should PUT an existing promotion catalog by id', function () {
      $httpBackend.expectPUT(/company-promotion-catalogs\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.updatePromotionCatalog(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should DELETE an existing promotion catalog by id', function () {
      $httpBackend.expectDELETE(/company-promotion-catalogs\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.deletePromotionCatalog(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should GET promotion catalog list', function () {
      $httpBackend.expectGET(/company-promotion-catalogs/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.getPromotionCatalogList({}).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should GET promotion catalog by id', function () {
      $httpBackend.expectGET(/promotion-catalog-conjunctions\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.getPromotionCatalogConjunction(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should POST a new promotion catalog record', function () {
      $httpBackend.expectPOST(/promotion-catalog-conjunctions/).respond(200, { fakeResponseKey: 'POST' });

      promotionCatalogService.createPromotionCatalogConjunction().then(function (response) {
        expect(response.fakeResponseKey).toBe('POST');
      });

      $httpBackend.flush();
    });

    it('should PUT an existing promotion catalog by id', function () {
      $httpBackend.expectPUT(/promotion-catalog-conjunctions\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.updatePromotionCatalogConjunction(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should DELETE an existing promotion catalog by id', function () {
      $httpBackend.expectDELETE(/promotion-catalog-conjunctions\/\d+/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      promotionCatalogService.deletePromotionCatalogConjunction(123).then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

  });
});
