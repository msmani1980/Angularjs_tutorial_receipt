'use strict';

  describe('Controller: CategoryListCtrl', function () {

  beforeEach(module('ts5App', 'template-module'));
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
      var expectedPayload = {
        name: scope.newCategory.name,
        description: scope.newCategory.description,
        parentCategoryId: null,
        nextCategoryId: null
      };
      scope.createCategory();
      expect(categoryFactory.createCategory).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('edit category', function () {
    var oldPayload;
    beforeEach(function () {
      oldPayload = {
        name: 'categoryName',
        description: 'categoryDescription',
        id: 1,
        parentId: 207,
        nextCategoryId: 2
      };
    });

    it('should call edit API', function () {
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalled();
    });

    it('should format payload with new name and description', function () {
      scope.categoryToEdit = {
        name: 'newName',
        description: 'newDescription',
        parentCategory: { id: 207 }
      };
      var expectedPayload = {
        id: 1,
        name: 'newName',
        description: 'newDescription',
        parentCategoryId: 207,
        nextCategoryId: 2
      };
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(oldPayload.id, expectedPayload);
    });

    it('should keep previous values if description is blank', function () {
      scope.categoryToEdit = {
        name: 'newName',
        parentCategory: { id: 207 }
      };
      var expectedPayload = {
        id: 1,
        name: 'newName',
        description: 'categoryDescription',
        parentCategoryId: 207,
        nextCategoryId: 2
      };
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(oldPayload.id, expectedPayload);
    });

    it('should set nextCategory to null if parent category is changed', function () {
      scope.categoryToEdit = {
        name: 'newName',
        description: 'newDescription',
        parentCategory: { id: 123 }
      };
      var expectedPayload = {
        id: 1,
        name: 'newName',
        description: 'newDescription',
        parentCategoryId: 123,
        nextCategoryId: null
      };
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(oldPayload.id, expectedPayload);
    });

    it('should not change nextCategory if parent category is not changed', function () {
      scope.categoryToEdit = {
        name: 'newName',
        description: 'newDescription',
        parentCategory: { id: 207 }
      };
      var expectedPayload = {
        id: 1,
        name: 'newName',
        description: 'newDescription',
        parentCategoryId: 207,
        nextCategoryId: 2
      };
      scope.saveEditChange(oldPayload);
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(oldPayload.id, expectedPayload);
    });

    it('should set parentId to null if no parent is passed in', function () {
      scope.categoryToEdit = {
        name: 'newName',
        description: 'newDescription',
        parentCategory: null
      };
      var expectedPayload = {
        id: 1,
        name: 'newName',
        description: 'newDescription',
        parentCategoryId: null,
        nextCategoryId: null
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
        id: 1,
        name: 'categoryName',
        description: 'newDescription',
        parentCategoryId: null,
        nextCategoryId: null
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

  describe('rearrange categories', function () {
    beforeEach(function () {
      scope.categoryList = [{
        id: 1,
        nextCategoryId: 2,
        totalChildCount: 0
      }, {
        id: 2,
        nextCategoryId: 3,
        totalChildCount: 0
      }, {
        id: 3,
        nextCategoryId: null,
        totalChildCount: 0
      }];
      scope.enterRearrangeMode(scope.categoryList[1]);
    });

    it('should swap category positions', function () {
      scope.rearrangeCategory(scope.categoryList[0], 0, 'up');
      expect(scope.categoryList[0].id).toEqual(2);
      expect(scope.categoryList[1].id).toEqual(1);

      scope.rearrangeCategory(scope.categoryList[2], 2, 'down');
      expect(scope.categoryList[2].id).toEqual(2);
      expect(scope.categoryList[1].id).toEqual(3);
    });

    it('should update next id', function () {
      scope.rearrangeCategory(scope.categoryList[0], 0, 'up');
      expect(scope.categoryList[0].nextCategoryId).toEqual(1);

      scope.rearrangeCategory(scope.categoryList[2], 2, 'down');
      expect(scope.categoryList[2].nextCategoryId).toEqual(null);
    });

    it('should reset list on cancel', function () {
      scope.cancelChange();
      expect(categoryFactory.getCategoryList).toHaveBeenCalled();
      expect(scope.categoryToMove).toEqual({});
      expect(scope.inRearrangeMode).toEqual(false);
    });

    it('should call update with new next id on save', function () {
      scope.rearrangeCategory(scope.categoryList[0], 0, 'up');
      scope.saveChange(scope.categoryList[0]);
      var expectedPayload = jasmine.objectContaining({ nextCategoryId: 1 });
      expect(categoryFactory.updateCategory).toHaveBeenCalledWith(scope.categoryToMove.id, expectedPayload);
    });
  });

  describe('search', function () {
    beforeEach(function () {
      scope.filter = {
        name: 'mockName',
        description: 'mockDescription',
        parentCategory: { id: 1 }
      };
    });

    it('should call GET API with filters', function () {
      var expectedPayload = {
        name: 'mockName',
        description: 'mockDescription',
        parentId: 1
      };
      scope.nestedCategoryList = salesCategoriesJSON.salesCategories;
      scope.search();
      expect(categoryFactory.getCategoryList).toHaveBeenCalledWith(expectedPayload);
    });

    it('should clear list and search on clearSearch', function () {
      scope.clearSearch();
      expect(scope.categoryList).toEqual([]);
      expect(scope.search).toEqual({});
    });
  });

  describe('scope helper functions', function () {
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

    describe('canEditOrRearrange', function () {
      it('should return true if in edit mode and category is selected', function () {
        scope.inEditMode = true;
        scope.categoryToEdit = { id: 1 };
        expect(scope.canEditOrRearrangeCategory({ id: 1 })).toEqual(true);
        expect(scope.canEditOrRearrangeCategory({ id: 2 })).toEqual(false);
      });

      it('should return true if in rearrange mode and category is selected', function () {
        scope.inRearrangeMode = true;
        scope.categoryToMove = { id: 1 };
        expect(scope.canEditOrRearrangeCategory({ id: 1 })).toEqual(true);
        expect(scope.canEditOrRearrangeCategory({ id: 2 })).toEqual(false);
      });
    });

    describe('canRearrange', function () {
      beforeEach(function () {
        scope.categoryToMove = { id: 1, parentId: 2, levelNum: 1 };
        scope.inRearrangeMode = true;
      });

      it('should return true for categories in the same level and parent', function () {
        var mockCategory = { id: 3, parentId: 2, levelNum: 1 };
        expect(scope.canRearrange(mockCategory)).toEqual(true);
        mockCategory.parentId = 4;
        expect(scope.canRearrange(mockCategory)).toEqual(false);
      });

      it('should return false for the selected category to move', function () {
        var mockCategory = { id: 1, parentId: 2, levelNum: 1 };
        expect(scope.canRearrange(mockCategory)).toEqual(false);
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
          parentId: null,
          levelNum: 1
        }];
        var mockCategory = {
          parentId: 1,
          levelNum: 2
        };
        var shouldShow = scope.shouldShowCategory(mockCategory);
        expect(shouldShow).toEqual(false);
      });

      it('should be open if all parents are open', function () {
        scope.categoryList = [{
          name: 'parent',
          id: 1,
          isOpen: true,
          parentId: null,
          levelNum: 1
        }];
        var mockCategory = {
          parentId: 1,
          levelNum: 2
        };
        var shouldShow = scope.shouldShowCategory(mockCategory);
        expect(shouldShow).toEqual(true);
      });
    });

    describe('get row class', function () {
      it('should return a class matching the categorys nested level', function () {
        var expectedClass = 'categoryLevel5';
        var mockCategory = { levelNum: 5 };
        scope.filter = {};
        expect(scope.getClassForRow(mockCategory)).toEqual(expectedClass);
      });

      it('should return the highest level class for categories nested above 10', function () {
        var expectedClass = 'categoryLevel10';
        var mockCategory = { levelNum: 11 };
        scope.filter = {};
        expect(scope.getClassForRow(mockCategory)).toEqual(expectedClass);
      });
    });

    describe('get toggle button class', function () {
      it('should return highlighted button class if row is open', function () {
        var expectedClass = 'btn btn-xs btn-info';
        var mockCategory = { isOpen: true };
        expect(scope.getToggleButtonClass(mockCategory)).toEqual(expectedClass);
      });

      it('should return plain button class if row is closed', function () {
        var expectedClass = 'btn btn-xs btn-default';
        var mockCategory = { isOpen: false };
        expect(scope.getToggleButtonClass(mockCategory)).toEqual(expectedClass);
      });
    });

    describe('get toggle icon class', function () {
      it('should return down arrow if row is open', function () {
        var expectedClass = 'fa fa-angle-down';
        var mockCategory = { isOpen: true };
        expect(scope.getToggleIconClass(mockCategory)).toEqual(expectedClass);
      });

      it('should return right arrow if row is closed', function () {
        var expectedClass = 'fa fa-angle-right';
        var mockCategory = { isOpen: false };
        expect(scope.getToggleIconClass(mockCategory)).toEqual(expectedClass);
      });
    });

    describe('toggle category', function () {
      it('should reverse current category open status', function () {
        var mockCategory = { isOpen: false };
        scope.toggleCategory(mockCategory);
        expect(mockCategory.isOpen).toEqual(true);
        scope.toggleCategory(mockCategory);
        expect(mockCategory.isOpen).toEqual(false);
      });
    });
  });

});
