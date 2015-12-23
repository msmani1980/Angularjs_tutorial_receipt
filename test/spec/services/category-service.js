'use strict';

fdescribe('Service: categoryService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-categories.json'));

  // instantiate service
  var categoryService,
    $httpBackend,
    categoryResponseJSON;

  beforeEach(inject(function (_categoryService_, $injector) {
    inject(function (_servedCompanyCategories_) {
      categoryResponseJSON = _servedCompanyCategories_;
    });
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/sales-categories/).respond(categoryResponseJSON);
    $httpBackend.whenDELETE(/sales-categories/).respond(201);
    $httpBackend.whenPOST(/sales-categories/).respond(201);
    $httpBackend.whenPUT(/sales-categories/).respond(201);
    categoryService = _categoryService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!categoryService).toBe(true);
  });

  describe('API calls', function () {
    var categoryData;

    describe('getCategoryList', function () {
      beforeEach(function () {
        categoryService.getCategoryList().then(function (categoryListFromAPI) {
          categoryData = categoryListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(categoryData.salesCategories.length).toBeGreaterThan(0);
      });

      it('should have a companyId property', function () {
        expect(categoryData.salesCategories[0].companyId).toBe(403);
      });
      it('should have a name property', function () {
        expect(categoryData.salesCategories[0].name).toBe('Soft drink');
      });
      it('should have a description property', function () {
        expect(categoryData.salesCategories[0].description).toBe('Soft drinks');
      });
      it('should have a salesCategoryPath property', function () {
        expect(categoryData.salesCategories[0].salesCategoryPath).toBe('Snacks/Soft drink');
      });
      it('should have a itemCount property', function () {
        expect(categoryData.salesCategories[0].itemCount).toBe('57');
      });
      it('should have a parentId property', function () {
        expect(categoryData.salesCategories[0].parentId).toBe(207);
      });
    });

    describe('search Categorys', function () {
      it('should fetch and return categoryList', function () {
        spyOn(categoryService, 'getCategoryList').and.callThrough();
        var payload = {
          someKey: 'someValue'
        };
        categoryService.getCategoryList(payload);
        $httpBackend.flush();
        expect(categoryService.getCategoryList).toHaveBeenCalledWith(payload);
      });
    });

    it('should delete category by category id', function () {
      $httpBackend.expectDELETE(/sales-categories/);
      categoryService.deleteCategory(1);
      $httpBackend.flush();
    });

    it('should create category by payload', function () {
      $httpBackend.expectPOST(/sales-categories/);
      var payload = {
        name: 'fakeName',
        description: 'fakeDescription',
        parentCategoryId: '2',
        nextCategoryId: '3'
      };
      categoryService.createCategory(0, payload);
      $httpBackend.flush();
    });

    it('should update category by payload', function () {
      $httpBackend.expectPUT(/sales-categories/);
      var payload = {
        name: 'fakeName',
        description: 'fakeDescription',
        parentCategoryId: '2',
        nextCategoryId: '3'
      };
      categoryService.updateCategory(1, 0, payload);
      $httpBackend.flush();
    });

  });
});
