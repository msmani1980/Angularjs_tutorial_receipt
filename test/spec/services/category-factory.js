'use strict';

fdescribe('Service: categoryFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var categoryFactory,
    categoryService;

  beforeEach(inject(function (_categoryFactory_, $injector) {
    categoryService = $injector.get('categoryService');

    spyOn(categoryService, 'getCategoryList').and.stub();
    spyOn(categoryService, 'deleteCategory').and.stub();

    categoryFactory = _categoryFactory_;
  }));

  it('should exists', function () {
    expect(!!categoryFactory).toBe(true);
  });

  describe('API Calls', function(){

    it('should call categoryService.getCategoryList with a payload', function () {
      var payload = {
        fake: 'data',
        id: 0
      };
      categoryFactory.getCategoryList(payload);
      expect(categoryService.getCategoryList).toHaveBeenCalledWith(payload);
    });

    it('should call categoryService.deleteCategory with a category id', function () {
      categoryFactory.deleteCategory(1);
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
    });

  });
});
