'use strict';

describe('Controller: PromotionCategoryListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/promotion-categories.json'));

  var PromotionCategoryListCtrl;
  var promotionCategoryFactory;
  var promotionCategoriesDeferred;
  var promotionCategoriesResponseJSON;
  var dateUtility;
  var lodash;
  var location;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {
    inject(function (_servedPromotionCategories_) {
      promotionCategoriesResponseJSON = _servedPromotionCategories_;
    });

    location = $location;
    promotionCategoryFactory = $injector.get('promotionCategoryFactory');
    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');
    scope = $rootScope.$new();

    promotionCategoriesDeferred = $q.defer();
    promotionCategoriesDeferred.resolve(promotionCategoriesResponseJSON);

    spyOn(promotionCategoryFactory, 'getPromotionCategoryList').and.returnValue(promotionCategoriesDeferred.promise);
    spyOn(promotionCategoryFactory, 'deletePromotionCategory').and.returnValue(promotionCategoriesDeferred.promise);
    spyOn(location, 'path').and.callThrough();

    PromotionCategoryListCtrl = $controller('PromotionCategoryListCtrl', {
      $scope: scope
    });

    scope.$digest();
  }));

  describe('initialize data', function () {
    it('should initialize promotion categories and search as empty', function () {
      expect(scope.promotionCategories).toEqual(null);
      expect(scope.search).toEqual({});
    });

    it('should initialize meta variables', function () {
      expect(PromotionCategoryListCtrl.meta).toBeDefined();
      expect(PromotionCategoryListCtrl.meta.limit).toEqual(100);
      expect(PromotionCategoryListCtrl.meta.offset).toEqual(0);
    });
  });

  describe('search/get promotion categories', function () {
    it('should get promotion categories from API', function () {
      scope.getPromotionCategories();
      expect(promotionCategoryFactory.getPromotionCategoryList).toHaveBeenCalled();
    });

    it('should format payload with formatted dates and reset meta variables', function () {
      scope.search = {
        startDate: '10/20/2010',
        endDate: '10/25/2011'
      };

      var expectedPayload = {
        startDate: '20101020',
        endDate: '20111025',
        limit: 100,
        offset: 0
      };

      scope.getPromotionCategories();
      expect(promotionCategoryFactory.getPromotionCategoryList).toHaveBeenCalledWith(expectedPayload);
    });


    it('should save API response to scope', function () {
      scope.getPromotionCategories();
      scope.$digest();
      expect(scope.promotionCategories.length > 0).toEqual(true);
    });

    it('should format response dates', function () {
      scope.getPromotionCategories();
      scope.$digest();

      var expectedStartDate = dateUtility.formatDateForApp(promotionCategoriesResponseJSON.companyPromotionCategories[0].startDate);
      var expectedEndDate = dateUtility.formatDateForApp(promotionCategoriesResponseJSON.companyPromotionCategories[0].endDate);

      expect(scope.promotionCategories[0].startDate).toEqual(expectedStartDate);
      expect(scope.promotionCategories[0].endDate).toEqual(expectedEndDate);
    });

    it('should update meta variables with each GET', function () {
      scope.getPromotionCategories();
      scope.$digest();

      expect(PromotionCategoryListCtrl.meta.offset).toEqual(100);
      expect(PromotionCategoryListCtrl.meta.count).toEqual(promotionCategoriesResponseJSON.meta.count);
    });

    it('should reset meta variables and promotionCategories variable for search', function () {
      scope.promotionCategories = [{ id: 123 }, { id: 435 }, { id: 345 }];
      PromotionCategoryListCtrl.meta = {
        count: 3,
        offset: 3,
        limit: 30
      };

      scope.searchPromotionCategories();
      scope.$digest();
      expect(scope.promotionCategories.length).toEqual(promotionCategoriesResponseJSON.companyPromotionCategories.length);
      var oldRecordMatch = lodash.findWhere(scope.promotionCategories, { id: 123 });
      expect(oldRecordMatch).not.toBeDefined();
      expect(PromotionCategoryListCtrl.meta.offset).toEqual(100);
      expect(PromotionCategoryListCtrl.meta.count).toEqual(scope.promotionCategories.length);
      expect(PromotionCategoryListCtrl.meta.limit).toEqual(100);
    });

    it('should clear search and promotion categories and meta variables on clear search', function () {
      scope.promotionCategories = [{ id: 123 }, { id: 435 }, { id: 345 }];
      scope.search = { fakeKey: 'fakeValue' };
      PromotionCategoryListCtrl.meta.offset = 3;

      scope.clearSearchForm();

      expect(scope.promotionCategories).toEqual(null);
      expect(scope.search).toEqual({});
      expect(PromotionCategoryListCtrl.meta.offset).toEqual(0);
    });
  });

  describe('delete', function () {
    it('should call delete API with record id', function () {
      var testRecord = { id: 123 };
      scope.removeRecord(testRecord);
      expect(promotionCategoryFactory.deletePromotionCategory).toHaveBeenCalledWith(testRecord.id);
    });
  });

  describe('scope helpers', function () {
    var futureRecord = { startDate: '10/20/2050', endDate: '11/30/2050' };
    var activeRecord = { startDate: '10/20/1980', endDate: '11/30/2050' };
    var pastRecord = { startDate: '10/20/1980', endDate: '11/30/1980' };

    it('should allow editing if record is future or active', function () {
      expect(scope.canEdit(futureRecord)).toEqual(true);
      expect(scope.canEdit(activeRecord)).toEqual(true);
      expect(scope.canEdit(pastRecord)).toEqual(false);
    });

    it('should allow deleting if record is in the future', function () {
      expect(scope.canDelete(futureRecord)).toEqual(true);
      expect(scope.canDelete(activeRecord)).toEqual(false);
      expect(scope.canDelete(pastRecord)).toEqual(false);
    });

    it('should redirect to create or edit page when viewing or editing a record', function () {
      scope.viewOrEditRecord('edit', 123);
      expect(location.path).toHaveBeenCalledWith('promotion-category/edit/123');

      scope.viewOrEditRecord('view', 123);
      expect(location.path).toHaveBeenCalledWith('promotion-category/view/123');
    });

    it('should show search prompt when promotion categories list is null', function () {
      scope.promotionCategories = null;
      expect(scope.shouldShowSearchPrompt()).toEqual(true);

      scope.promotionCategories = [];
      expect(scope.shouldShowSearchPrompt()).toEqual(false);
    });

    it('should show no records prompt when store instance list is empty', function () {
      scope.promotionCategories = null;
      expect(scope.shouldShowNoRecordsFoundPrompt()).toEqual(false);

      scope.promotionCategories = [];
      expect(scope.shouldShowNoRecordsFoundPrompt()).toEqual(true);
    });

    it('should show loading alert when promotion categories list is not empty and offset < count', function () {
      scope.promotionCategories = [{ id: 1 }];
      PromotionCategoryListCtrl.meta = {
        offset: 10,
        count: 100
      };
      expect(scope.shouldShowLoadingAlert()).toEqual(true);
    });
  });
});
