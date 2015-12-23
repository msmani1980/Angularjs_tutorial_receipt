'use strict';

describe('Service: categoryFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var categoryFactory,
    categoryService;

  beforeEach(inject(function (_categoryFactory_, $injector) {
    categoryService = $injector.get('categoryService');

    spyOn(categoryService, 'getCategory').and.stub();
    spyOn(categoryService, 'getCategoryList').and.stub();
    spyOn(categoryService, 'deleteCategory').and.stub();
    spyOn(categoryService, 'updateCategory').and.stub();
    spyOn(categoryService, 'createCategory').and.stub();

    categoryFactory = _categoryFactory_;
  }));

  it('should exists', function () {
    expect(!!categoryFactory).toBe(true);
  });

  describe('API Calls', function(){

    it('should call categoryService.getCategoryList with a payload', function () {
      var payload = {
        fake: 'data',
        id: 0,
        companyId: 0
      };
      categoryFactory.getCategoryList(payload);
      expect(categoryService.getCategoryList).toHaveBeenCalledWith(payload);
    });

    it('should call categoryService.getCategory with a payload', function () {
      categoryFactory.getCategory(1);
      expect(categoryService.getCategory).toHaveBeenCalledWith({id: 1, companyId: 0});
    });

    it('should call categoryService.deleteCategory with a category id', function () {
      categoryFactory.deleteCategory(1);
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
    });

    it('should call categoryService.updateCategory with a category id', function () {
      var payload = {
        name: 'fakeName',
        description: 'fakeDescription',
        parentCategoryId: '2',
        nextCategoryId: '3'
      };
      categoryFactory.updateCategory(1, payload);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(1, 0, payload);
    });

    it('should call categoryService.createCategory with a category id', function () {
      var payload = {
        name: 'fakeName',
        description: 'fakeDescription',
        parentCategoryId: '2',
        nextCategoryId: '3'
      };
      categoryFactory.createCategory(payload);
      expect(categoryService.createCategory).toHaveBeenCalledWith(0, payload);
    });

  });
});
