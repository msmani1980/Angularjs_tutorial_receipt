'use strict';

describe('Service: promotionCatalogFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  var promotionCatalogFactory,
    promotionCatalogService,
    promotionsService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _promotionCatalogFactory_, _promotionCatalogService_, _promotionsService_) {
    promotionCatalogService = _promotionCatalogService_;
    promotionsService = _promotionsService_;

    spyOn(promotionCatalogService, 'getPromotionCatalogList');
    spyOn(promotionCatalogService, 'getPromotionCatalog');
    spyOn(promotionCatalogService, 'createPromotionCatalog');
    spyOn(promotionCatalogService, 'updatePromotionCatalog');
    spyOn(promotionCatalogService, 'deletePromotionCatalog');
    spyOn(promotionsService, 'getPromotions');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    promotionCatalogFactory = _promotionCatalogFactory_;
  }));

  it('should be defined', function () {
    expect(!!promotionCatalogFactory).toBe(true);
  });

  describe('promotionCatalogService API', function () {
    it('should call promotionCatalogService on getPromotionCatalogList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCatalogFactory.getPromotionCatalogList(mockPayload);
      expect(promotionCatalogService.getPromotionCatalogList).toHaveBeenCalledWith(mockPayload);
    });

    it('should call promotionCatalogService on getPromotionCatalog', function () {
      var mockId = 123;
      promotionCatalogFactory.getPromotionCatalog(mockId);
      expect(promotionCatalogService.getPromotionCatalog).toHaveBeenCalledWith(mockId);
    });

    it('should call promotionCatalogService on createPromotionCatalog', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCatalogFactory.createPromotionCatalog(mockPayload);
      expect(promotionCatalogService.createPromotionCatalog).toHaveBeenCalledWith(mockPayload);
    });

    it('should call promotionCatalogService on updatePromotionCatalog', function () {
      var mockId = 123;
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCatalogFactory.updatePromotionCatalog(mockId, mockPayload);
      expect(promotionCatalogService.updatePromotionCatalog).toHaveBeenCalledWith(mockId, mockPayload);
    });

    it('should call promotionCatalogService on deletePromotionCatalog', function () {
      var mockId = 123;
      promotionCatalogFactory.deletePromotionCatalog(mockId);
      expect(promotionCatalogService.deletePromotionCatalog).toHaveBeenCalledWith(mockId);
    });
  });

  describe('promotionsService API', function () {
    it('should call promotionsService on getPromotionList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCatalogFactory.getPromotionList(mockPayload);
      expect(promotionsService.getPromotions).toHaveBeenCalledWith(mockPayload);
    });
  });

});
