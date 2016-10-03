'use strict';

describe('Service: promotionCategoryFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  var promotionCategoryFactory,
    promotionCategoriesService,
    itemsService,
    categoryService,
    globalMenuService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _promotionCategoryFactory_, _promotionCategoriesService_, _itemsService_, _categoryService_, _globalMenuService_) {
    promotionCategoriesService = _promotionCategoriesService_;
    itemsService = _itemsService_;
    categoryService = _categoryService_;
    globalMenuService = _globalMenuService_;

    spyOn(categoryService, 'getCategoryList');
    spyOn(itemsService, 'getItemsList');
    spyOn(promotionCategoriesService, 'getPromotionCategories');
    spyOn(promotionCategoriesService, 'getPromotionCategory');
    spyOn(promotionCategoriesService, 'createPromotionCategory');
    spyOn(promotionCategoriesService, 'updatePromotionCategory');
    spyOn(promotionCategoriesService, 'deletePromotionCategory');

    var mockCompanyData = { id: 403 };
    spyOn(globalMenuService, 'getCompanyData').and.returnValue(mockCompanyData);

    rootScope = $rootScope;
    scope = $rootScope.$new();
    promotionCategoryFactory = _promotionCategoryFactory_;
  }));

  it('should be defined', function () {
    expect(!!promotionCategoryFactory).toBe(true);
  });

  describe('categoryService API', function () {
    it('should call exciseDutyService on getExciseDutyList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      var expectedPayload = { fakeKey: 'fakeValue', companyId: 403 };
      promotionCategoryFactory.getCategoryList(mockPayload);
      expect(categoryService.getCategoryList).toHaveBeenCalledWith(expectedPayload);
    });

  });

  describe('itemsService API', function () {
    it('should call itemsService on getItemsList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCategoryFactory.getMasterItemList(mockPayload);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(mockPayload, true);
    });
  });

  describe('promotionCategoriesService API', function () {
    it('should call promotionCategoriesService on getPromotionCategoryList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCategoryFactory.getPromotionCategoryList(mockPayload);
      expect(promotionCategoriesService.getPromotionCategories).toHaveBeenCalledWith(mockPayload);
    });

    it('should call promotionCategoriesService on getPromotionCategory', function () {
      var mockId = 123;
      promotionCategoryFactory.getPromotionCategory(mockId);
      expect(promotionCategoriesService.getPromotionCategory).toHaveBeenCalledWith(mockId);
    });

    it('should call promotionCategoriesService on createPromotionCategory', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCategoryFactory.createPromotionCategory(mockPayload);
      expect(promotionCategoriesService.createPromotionCategory).toHaveBeenCalledWith(mockPayload);
    });

    it('should call promotionCategoriesService on updatePromotionCategory', function () {
      var mockId = 123;
      var mockPayload = { fakeKey: 'fakeValue' };
      promotionCategoryFactory.updatePromotionCategory(mockId, mockPayload);
      expect(promotionCategoriesService.updatePromotionCategory).toHaveBeenCalledWith(mockId, mockPayload);
    });

    it('should call promotionCategoriesService on deletePromotionCategory', function () {
      var mockId = 123;
      promotionCategoryFactory.deletePromotionCategory(mockId);
      expect(promotionCategoriesService.deletePromotionCategory).toHaveBeenCalledWith(mockId);
    });
  });

});
