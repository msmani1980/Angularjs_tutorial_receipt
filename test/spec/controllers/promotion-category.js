'use strict';

describe('Controller: PromotionCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/sales-categories.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/promotion-category.json'));

  var PromotionCategoryCtrl;
  var promotionCategoryFactory;
  var promotionCategoryDeferred;
  var promotionCategoryResponseJSON;
  var categoryListDeferred;
  var categoryListResponseJSON;
  var itemListDeferred;
  var itemListResponseJSON;
  var routeParams;
  var dateUtility;
  var lodash;
  var location;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {
    inject(function (_servedSalesCategories_, _servedMasterItemList_, _servedPromotionCategory_) {
      promotionCategoryResponseJSON = _servedPromotionCategory_;
      itemListResponseJSON = _servedMasterItemList_;
      categoryListResponseJSON = _servedSalesCategories_;
    });

    location = $location;
    promotionCategoryFactory = $injector.get('promotionCategoryFactory');
    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');
    scope = $rootScope.$new();

    promotionCategoryDeferred = $q.defer();
    promotionCategoryDeferred.resolve(promotionCategoryResponseJSON);
    categoryListDeferred = $q.defer();
    categoryListDeferred.resolve(categoryListResponseJSON);
    itemListDeferred = $q.defer();
    itemListDeferred.resolve(itemListResponseJSON);

    spyOn(promotionCategoryFactory, 'getCategoryList').and.returnValue(categoryListDeferred.promise);
    spyOn(promotionCategoryFactory, 'getCompanyId').and.returnValue(403);
    spyOn(promotionCategoryFactory, 'getMasterItemList').and.returnValue(itemListDeferred.promise);
    spyOn(promotionCategoryFactory, 'getPromotionCategory').and.returnValue(promotionCategoryDeferred.promise);
    spyOn(promotionCategoryFactory, 'createPromotionCategory').and.returnValue(promotionCategoryDeferred.promise);
    spyOn(promotionCategoryFactory, 'updatePromotionCategory').and.returnValue(promotionCategoryDeferred.promise);
    spyOn(promotionCategoryFactory, 'deletePromotionCategory').and.returnValue(promotionCategoryDeferred.promise);
    spyOn(location, 'path').and.callThrough();

    routeParams = {
      id: '123',
      action: 'edit'
    };

    PromotionCategoryCtrl = $controller('PromotionCategoryCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    scope.$digest();
  }));

  describe('initializeData', function () {
    it('should get sales category list', function () {
      expect(promotionCategoryFactory.getCategoryList).toHaveBeenCalled();
      scope.$digest();
      expect(scope.categoryList).toBeDefined();
      expect(scope.categoryList.length > 0).toEqual(true);
    });

    it('should get promotion category by id if in edit mode', function () {
      expect(promotionCategoryFactory.getPromotionCategory).toHaveBeenCalledWith(routeParams.id);
      expect(scope.promotionCategory).toBeDefined();
    });

    it('should get master item list if in edit mode', function () {
      expect(promotionCategoryFactory.getMasterItemList).toHaveBeenCalled();
    });

    describe('format promotion category', function () {
      it('should format start and end date for app', function () {
        var expectedStartDate = dateUtility.formatDateForApp(promotionCategoryResponseJSON.startDate);
        var expectedEndDate = dateUtility.formatDateForApp(promotionCategoryResponseJSON.endDate);

        expect(scope.promotionCategory.startDate).toEqual(expectedStartDate);
        expect(scope.promotionCategory.endDate).toEqual(expectedEndDate);
      });

      it('should format items and add to itemList', function () {
        expect(scope.itemList.length).toEqual(promotionCategoryResponseJSON.companyPromotionCategoryItems.length);

        var responseItem = promotionCategoryResponseJSON.companyPromotionCategoryItems[0];
        expect(scope.itemList[0].selectedCategory).toBeDefined();
        expect(scope.itemList[0].selectedItem).toBeDefined();
        expect(scope.itemList[0].selectedItem.id).toEqual(responseItem.itemId);
        expect(scope.itemList[0].recordId).toEqual(responseItem.id);
      });
    });

    it('should set viewOnly and editOnly variables', function () {
      scope.$digest();
      expect(scope.isViewOnly).toBeDefined();
      expect(scope.disableEditField).toBeDefined();
    });

    describe('view only and disable edit variables', function () {
      it('should set viewOnly to true on edit if record is in the past', function () {
        scope.$digest();
        scope.promotionCategory = { startDate: '10/20/1980', endDate: '11/21/1981' };
        PromotionCategoryCtrl.setViewVariables();

        expect(scope.isViewOnly).toEqual(true);
      });

      it('should not disable edit fields if record is in the future' , function () {
        scope.$digest();
        scope.promotionCategory = { startDate: '10/20/2050', endDate: '11/21/2051' };
        PromotionCategoryCtrl.setViewVariables();

        expect(scope.disableEditField).toEqual(false);
      });

      it('should disable edit fields for active records', function () {
        scope.$digest();
        scope.promotionCategory = { startDate: '10/20/1980', endDate: '11/21/2051' };
        PromotionCategoryCtrl.setViewVariables();

        expect(scope.disableEditField).toEqual(true);
        expect(scope.isViewOnly).toEqual(false);
      });
    });
  });

  describe('adding and removing items', function () {
    beforeEach(function () {
      scope.itemList = [{ itemIndex: 0, masterItemList: [{ id: 123 }], selectedItem: { id: 123 } }];
    });

    it('should add empty item to item list', function () {
      scope.addItem();
      expect(scope.itemList.length).toEqual(2);
      expect(scope.itemList[1].itemIndex).toEqual(1);
    });

    it('should remove the given item from the list', function () {
      var oldItem = scope.itemList[0];
      scope.removeItem(oldItem);
      expect(scope.itemList.length).toEqual(0);
    });
  });

  describe('selecting items', function () {
    it('should refresh master item list if date changes', function () {
      scope.$digest();
      scope.promotionCategory.startDate = '10/10/2016';
      scope.promotionCategory.endDate = '10/15/2016';
      scope.$digest();

      var expectedPayload = {
        startDate: '20161010',
        endDate: '20161015'
      };

      expect(promotionCategoryFactory.getMasterItemList).toHaveBeenCalledWith(expectedPayload);
    });

    it('should filter item list by category when a category is selected', function () {
      var testItem = {
        itemIndex: 0,
        masterItemList: [],
        selectedCategory: { id: 123 },
        selectedItem: null
      };

      scope.filterItemListFromCategory(testItem);

      var expectedPayload = {
        categoryId: 123,
        startDate: '20160926',
        endDate: '20161101'
      };

      expect(promotionCategoryFactory.getMasterItemList).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('saving promotion category', function () {
    beforeEach(function () {
      scope.promotionCategoryForm = {
        $valid: true
      };

      scope.itemList = [{
        selectedItem: { id: 456 },
        selectedCategory: { id: 789 },
        recordId: 234
      }];

      scope.save();
    });

    it('should call update if editing', function () {
      expect(promotionCategoryFactory.updatePromotionCategory).toHaveBeenCalled();
    });

    it('should format payload and itemlist', function () {
      var expectedItemList = [{
        companyPromotionCategoryId: 123,
        itemId: 456,
        id: 234,
        salesCategoryId: 789
      }];
      var expectedPayload = {
        id: parseInt(routeParams.id),
        startDate: '20160926',
        endDate: '20161101',
        promotionCategoryName: 'testnewrecord123',
        companyId: 403,
        companyPromotionCategoryItems: expectedItemList
      };

      expect(promotionCategoryFactory.updatePromotionCategory).toHaveBeenCalledWith(routeParams.id, expectedPayload);
    });

    it('should navigate to list page after save', function () {
      scope.$digest();
      expect(location.path).toHaveBeenCalledWith('promotion-category-list');
    });
  });
});
