'use strict';

describe('Controller: EmployeeMessageListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/expanded-sales-categories.json'));

  var CategoryListCtrl;
  var categoryFactory;
  var location;
  var controller;
  var scope;

  var salesCategoriesDeferred;
  var salesCategoriesJSON;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    inject(function (_servedExpandedSalesCategories_) {
      salesCategoriesJSON = _servedExpandedSalesCategories_;
    });

    location = $location;
    scope = $rootScope.$new();
    categoryFactory = $injector.get('categoryFactory');
    controller = $controller;

    salesCategoriesDeferred = $q.defer();
    salesCategoriesDeferred.resolve(salesCategoriesJSON);

    spyOn(categoryFactory, 'getCategoryList').and.returnValue(salesCategoriesDeferred.promise);
    spyOn(categoryFactory, 'deleteCategory').and.returnValue(salesCategoriesDeferred.promise);
    spyOn(categoryFactory, 'createCategory').and.returnValue(salesCategoriesDeferred.promise);
    spyOn(categoryFactory, 'updateCategory').and.returnValue(salesCategoriesDeferred.promise);

    CategoryListCtrl = $controller('CategoryListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('init', function () {
    it('should set viewName', function () {
      expect(scope.viewName).toBeDefined();
    });

    it('should initialize with an empty filter', function () {
      expect(scope.filter).toEqual({});
    });

    it('should initialize with an empty new category model', function () {
      expect(scope.newCategory).toEqual({});
    });

    describe('get list of categories', function () {
      it('should get formatted list of categories from API', function () {
        var expectedPayload = { parentId: 0, expand: true };
        expect(categoryFactory.getCategoryList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should calculate max number of category levels', function () {
        expect(scope.numCategoryLevels).toBeDefined();
        expect(scope.numCategoryLevels).toEqual(5); // number of nested levels in expandedSalesCategoriesJSON
      });

      describe('category list reformatting', function () {
        it('should attach reformatted category list to scope', function () {
          expect(scope.categoryList).toBeDefined();
          expect(scope.categoryList).not.toEqual(salesCategoriesJSON.salesCategories);
        });

        it('should flatten nested structure', function () {
          expect(scope.categoryList.length > salesCategoriesJSON.salesCategories.length).toEqual(true);
        });

        it('should calculate the categorys nested level', function () {
          expect(scope.categoryList[0].levelNum).toBeDefined();
          expect(scope.categoryList[1].levelNum).toEqual(2); // nested element in expandedSalesCategoryJSON
        });
      });
    });
  });


  describe('create category', function () {
    beforeEach(function () {
      scope.newCategoryForm = {
        $valid: true
      };
    });
    it('should call create API', function () {
      scope.createCategory();
      expect(categoryFactory.createCategory).toHaveBeenCalled();
    });

    it('should format create payload', function () {
      scope.newCategory = {
        name: 'New Name',
        description: 'New description',
        parentCategory: { id: 1 },
        nextCategory: { id: 2 }
      };
      var expectedPayload = {
        name: 'New Name',
        description: 'New description',
        parentCategoryId: 1,
        nextCategoryId: 2
      };
      scope.createCategory();
      expect(categoryFactory.createCategory).toHaveBeenCalledWith(expectedPayload);
    });

    it('should not require parentId and nextCategory', function () {
      scope.newCategory = {
        name: 'New Name',
        description: 'New description'
      };
      scope.createCategory();
      expect(categoryFactory.createCategory).toHaveBeenCalledWith(scope.newCategory);
    });
  });

  describe('edit category', function () {
    var oldPayload;
    beforeEach(function () {
      oldPayload = {
        name: 'categoryName',
        description: 'categoryDescription',
        id: 1
      };
    });
    it('should call edit API', function () {
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalled();
    });
    it('should format payload with new name and description', function () {
      scope.categoryToEdit = {
        name: 'newName',
        description: 'newDescription'
      };
      var expectedPayload = {
        name: 'newName',
        description: 'newDescription'
      };
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(oldPayload.id, expectedPayload);
    });

    it('should keep previous values if description is blank', function () {
      scope.categoryToEdit = {
        name: 'newName'
      };
      var expectedPayload = {
        name: 'newName',
        description: 'categoryDescription'
      };
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(oldPayload.id, expectedPayload);
    });

    it('should keep previous values if description is blank', function () {
      scope.categoryToEdit = {
        description: 'newDescription',
        name: ''
      };
      var expectedPayload = {
        name: 'categoryName',
        description: 'newDescription'
      };
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(oldPayload.id, expectedPayload);
    });
  });

  describe('delete record', function () {
    it('should call delete API with given category id', function () {
      var mockCategory = { id: 1 };
      scope.removeRecord(mockCategory);
      expect(categoryFactory.deleteCategory).toHaveBeenCalledWith(1);
    });
  });

  describe('scope helper functions', function () {
    it('should clear newCategory model with clearCreateFrom function', function () {
      scope.newCategory = { test: 'test' };
      scope.clearCreateForm();
      expect(scope.newCategory).toEqual({});
    });

    it('should clear searchModel with clearSearchForm function', function () {
      scope.filter = { test: 'test' };
      scope.clearSearchForm();
      expect(scope.filter).toEqual({});
    });

    describe('canDeleteCategory', function () {
      it('should return false if category has children', function () {
        var mockCategory = {
          itemCount: 0,
          childCategoryCount: 5
        };
        var canDelete = scope.canDeleteCategory(mockCategory);
        expect(canDelete).toEqual(false);
      });

      it('should return false if category has items', function () {
        var mockCategory = {
          itemCount: 5,
          childCategoryCount: null
        };
        var canDelete = scope.canDeleteCategory(mockCategory);
        expect(canDelete).toEqual(false);
      });
      it('should return true if category has no items or children', function () {
        var mockCategory = {
          itemCount: 0,
          childCategoryCount: 0
        };
        var canDelete = scope.canDeleteCategory(mockCategory);
        expect(canDelete).toEqual(true);
      });

    });

    describe('isUserFiltering function', function () {
      it('should return false if filter model is empty', function () {
        scope.filter = {};
        var isFiltering = scope.isUserFiltering();
        expect(isFiltering).toEqual(false);
      });
      it('should return false if name and description are empty', function () {
        scope.filter = { name: '' };
        var isFiltering = scope.isUserFiltering();
        expect(isFiltering).toEqual(false);
        scope.filter = { description: '' };
        isFiltering = scope.isUserFiltering();
        expect(isFiltering).toEqual(false);
        scope.filter = { name: '', description: '' };
        isFiltering = scope.isUserFiltering();
        expect(isFiltering).toEqual(false);

      });
      it('should return true if name or description is populated', function () {
        scope.filter = { name: 'test' };
        var isFiltering = scope.isUserFiltering();
        expect(isFiltering).toEqual(true);
        scope.filter = { description: 'test' };
        isFiltering = scope.isUserFiltering();
        expect(isFiltering).toEqual(true);
      });
    });

    describe('shouldShowCategory', function () {
      it('should be open if category has no parents', function () {
        var mockCategory = {
          parentId: null
        };
        var shouldShow = scope.shouldShowCategory(mockCategory);
        expect(shouldShow).toEqual(true);
      });
      it('should be closed if category parent is closed', function () {
        scope.categoryList = [{
          name: 'parent',
          id: 1,
          isOpen: false,
          parentId: null
        }];
        var mockCategory = {
          parentId: 1
        };
        var shouldShow = scope.shouldShowCategory(mockCategory);
        expect(shouldShow).toEqual(false);
      });
      it('should be open if all parents are open', function () {
        scope.categoryList = [{
          name: 'parent',
          id: 1,
          isOpen: true,
          parentId: null
        }];
        var mockCategory = {
          parentId: 1
        };
        var shouldShow = scope.shouldShowCategory(mockCategory);
        expect(shouldShow).toEqual(true);
      });
    });
  });

});
