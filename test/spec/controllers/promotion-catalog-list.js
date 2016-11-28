'use strict';

describe('Controller: PromotionCatalogListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/promotion-catalog-list.json'));

  var PromotionCatalogListCtrl;
  var promotionCatalogFactory;
  var promotionCatalogListDeferred;
  var promotionCatalogListResponseJSON;
  var dateUtility;
  var lodash;
  var location;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {
    inject(function (_servedPromotionCatalogList_) {
      promotionCatalogListResponseJSON = _servedPromotionCatalogList_;
    });

    location = $location;
    promotionCatalogFactory = $injector.get('promotionCatalogFactory');
    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');
    scope = $rootScope.$new();

    promotionCatalogListDeferred = $q.defer();
    promotionCatalogListDeferred.resolve(promotionCatalogListResponseJSON);

    spyOn(promotionCatalogFactory, 'getPromotionCatalogList').and.returnValue(promotionCatalogListDeferred.promise);
    spyOn(promotionCatalogFactory, 'deletePromotionCatalog').and.returnValue(promotionCatalogListDeferred.promise);
    spyOn(location, 'path').and.callThrough();

    PromotionCatalogListCtrl = $controller('PromotionCatalogListCtrl', {
      $scope: scope
    });

    scope.$digest();
  }));

  describe('initialize data', function () {
    it('should initialize promotion categories and search as empty', function () {
      expect(scope.promotionCatalogs).toEqual(null);
      expect(scope.search).toEqual({});
    });

    it('should initialize meta variables', function () {
      expect(PromotionCatalogListCtrl.meta).toBeDefined();
      expect(PromotionCatalogListCtrl.meta.limit).toEqual(100);
      expect(PromotionCatalogListCtrl.meta.offset).toEqual(0);
    });
  });

  describe('search/get promotion categories', function () {
    it('should get promotion categories from API', function () {
      scope.getPromotionCatalogs();
      expect(promotionCatalogFactory.getPromotionCatalogList).toHaveBeenCalled();
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

      scope.getPromotionCatalogs();
      expect(promotionCatalogFactory.getPromotionCatalogList).toHaveBeenCalledWith(expectedPayload);
    });


    it('should save API response to scope', function () {
      scope.getPromotionCatalogs();
      scope.$digest();
      expect(scope.promotionCatalogs.length > 0).toEqual(true);
    });

    it('should format response dates', function () {
      scope.getPromotionCatalogs();
      scope.$digest();

      var expectedStartDate = dateUtility.formatDateForApp(promotionCatalogListResponseJSON.companyPromotionCatalogs[0].startDate);
      var expectedEndDate = dateUtility.formatDateForApp(promotionCatalogListResponseJSON.companyPromotionCatalogs[0].endDate);

      expect(scope.promotionCatalogs[0].startDate).toEqual(expectedStartDate);
      expect(scope.promotionCatalogs[0].endDate).toEqual(expectedEndDate);
    });

    it('should update meta variables with each GET', function () {
      scope.getPromotionCatalogs();
      scope.$digest();

      expect(PromotionCatalogListCtrl.meta.offset).toEqual(100);
      expect(PromotionCatalogListCtrl.meta.count).toEqual(promotionCatalogListResponseJSON.meta.count);
    });

    it('should reset meta variables and promotionCategories variable for search', function () {
      scope.promotionCatalogs = [{ id: 123 }, { id: 435 }, { id: 345 }];
      PromotionCatalogListCtrl.meta = {
        count: 3,
        offset: 3,
        limit: 30
      };

      scope.searchPromotionCatalogs();
      scope.$digest();
      expect(scope.promotionCatalogs.length).toEqual(promotionCatalogListResponseJSON.companyPromotionCatalogs.length);
      var oldRecordMatch = lodash.findWhere(scope.promotionCatalogs, { id: 123 });
      expect(oldRecordMatch).not.toBeDefined();

      expect(PromotionCatalogListCtrl.meta.offset).toEqual(100);
      expect(PromotionCatalogListCtrl.meta.count).toEqual(scope.promotionCatalogs.length);
      expect(PromotionCatalogListCtrl.meta.limit).toEqual(100);
    });

    it('should clear search and promotion categories and meta variables on clear search', function () {
      scope.promotionCatalogs = [{ id: 123 }, { id: 435 }, { id: 345 }];
      scope.search = { fakeKey: 'fakeValue' };
      PromotionCatalogListCtrl.meta.offset = 3;

      scope.clearSearchForm();

      expect(scope.promotionCatalogs).toEqual(null);
      expect(scope.search).toEqual({});
      expect(PromotionCatalogListCtrl.meta.offset).toEqual(0);
    });
  });

  describe('delete', function () {
    it('should call delete API with record id', function () {
      var testRecord = { id: 123 };
      scope.removeRecord(testRecord);
      expect(promotionCatalogFactory.deletePromotionCatalog).toHaveBeenCalledWith(testRecord.id);
    });

    it('should redo search after delte', function () {
      var testRecord = { id: 123 };
      scope.removeRecord(testRecord);

      scope.$digest();
      expect(promotionCatalogFactory.getPromotionCatalogList).toHaveBeenCalled();
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
      scope.redirectRecordToAction('edit', 123, false);
      expect(location.path).toHaveBeenCalledWith('promotion-catalog/edit/123');

      scope.redirectRecordToAction('view', 123, false);
      expect(location.path).toHaveBeenCalledWith('promotion-catalog/view/123');
    });

    it('should be able to redirect to conjunction page', function () {
      scope.redirectRecordToAction('edit', 123, true);
      expect(location.path).toHaveBeenCalledWith('promotion-catalog-conjunction/edit/123');

      scope.redirectRecordToAction('create', 123, true);
      expect(location.path).toHaveBeenCalledWith('promotion-catalog-conjunction/create/123');
    });


    it('should show search prompt when promotion categories list is null', function () {
      scope.promotionCatalogs = null;
      expect(scope.shouldShowSearchPrompt()).toEqual(true);

      scope.promotionCatalogs = [];
      expect(scope.shouldShowSearchPrompt()).toEqual(false);
    });

    it('should show no records prompt when store instance list is empty', function () {
      scope.promotionCatalogs = null;
      expect(scope.shouldShowNoRecordsFoundPrompt()).toEqual(false);

      scope.promotionCatalogs = [];
      expect(scope.shouldShowNoRecordsFoundPrompt()).toEqual(true);
    });

    it('should show loading alert when promotion categories list is not empty and offset < count', function () {
      scope.promotionCatalogs = [{ id: 1 }];
      PromotionCatalogListCtrl.meta = {
        offset: 10,
        count: 100
      };
      expect(scope.shouldShowLoadingAlert()).toEqual(true);
    });
  });
});
