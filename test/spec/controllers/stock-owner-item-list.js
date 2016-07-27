'use strict';

describe('The StockOwnerItemListCtrl controller', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/sales-categories.json'));

  var StockOwnerItemListCtrl;
  var scope;
  var getItemsListDeferred;
  var itemsFactory;
  var itemsListJSON;
  var getItemTypesListDeferred;
  var itemTypesService;
  var itemTypesJSON;
  var getSalesCategoriesDeferred;
  var salesCategoriesService;
  var salesCategoriesJSON;
  var location;
  var httpBackend;

  beforeEach(inject(function($q, $controller, $rootScope, _itemsFactory_, _itemTypesService_,
    _salesCategoriesService_, $location, $httpBackend) {

    inject(function(_servedItemsList_, _servedItemTypes_,
      _servedSalesCategories_) {
      itemsListJSON = _servedItemsList_;
      itemTypesJSON = _servedItemTypes_;
      salesCategoriesJSON = _servedSalesCategories_;
    });

    httpBackend = $httpBackend;
    location = $location;
    scope = $rootScope.$new();

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(itemsListJSON);
    itemsFactory = _itemsFactory_;
    spyOn(itemsFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);

    getItemTypesListDeferred = $q.defer();
    getItemTypesListDeferred.resolve(itemTypesJSON);
    itemTypesService = _itemTypesService_;
    spyOn(itemTypesService, 'getItemTypesList').and.returnValue(getItemTypesListDeferred.promise);

    getSalesCategoriesDeferred = $q.defer();
    getSalesCategoriesDeferred.resolve(salesCategoriesJSON);
    salesCategoriesService = _salesCategoriesService_;
    spyOn(salesCategoriesService, 'getSalesCategoriesList').and.returnValue(getSalesCategoriesDeferred.promise);

    spyOn(itemsFactory, 'removeItem').and.returnValue({
      then: function(callBack) {
        return callBack();
      }
    });

    StockOwnerItemListCtrl = $controller('StockOwnerItemListCtrl', {
      $scope: scope
    });

    spyOn(scope, 'searchRecords');
    spyOn(StockOwnerItemListCtrl, 'getItemsList').and.callThrough();
    spyOn(StockOwnerItemListCtrl, 'getItemTypesList').and.callThrough();
    spyOn(StockOwnerItemListCtrl, 'getSalesCategoriesList').and.callThrough();
    spyOn(StockOwnerItemListCtrl, 'generateItemQuery').and.callThrough();
    spyOn(StockOwnerItemListCtrl, 'displayLoadingModal').and.callThrough();

    StockOwnerItemListCtrl.getItemsList();
    StockOwnerItemListCtrl.getItemTypesList();
    StockOwnerItemListCtrl.getSalesCategoriesList();
    StockOwnerItemListCtrl.generateItemQuery();
    StockOwnerItemListCtrl.displayLoadingModal();

    scope.$digest();
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a getItemsList method', function() {
    expect(StockOwnerItemListCtrl.getItemsList).toBeDefined();
  });

  it('should call the getItemsList method', function() {
    expect(StockOwnerItemListCtrl.getItemsList).toHaveBeenCalled();
  });

  it('should have a getItemTypesList method', function() {
    expect(StockOwnerItemListCtrl.getItemTypesList).toBeDefined();
  });

  it('should call the getItemTypesList method', function() {
    expect(StockOwnerItemListCtrl.getItemTypesList).toHaveBeenCalled();
  });

  it('should have a getItemsList method', function() {
    expect(StockOwnerItemListCtrl.getItemsList).toBeDefined();
  });

  it('should call the getSalesCategoriesList method', function() {
    expect(StockOwnerItemListCtrl.getSalesCategoriesList).toHaveBeenCalled();
  });

  it('should have a filterItems method', function() {
    expect(StockOwnerItemListCtrl.filterItems).toBeDefined();
  });

  it('should have a generateItemQuery method', function() {
    expect(StockOwnerItemListCtrl.generateItemQuery).toBeDefined();
  });

  describe('The itemsList array', function() {

    it('should be attached to the scope', function() {
      expect(scope.itemsList).toBeDefined();
    });

    it('should have more than 1 item in the itemsList', function() {
      expect(scope.itemsList.length).toBeGreaterThan(1);
    });

    it('should match the response from the API', function() {
      expect(scope.itemsList.length).toEqual(itemsListJSON.retailItems.length);
    });

    it('should have a isItemActive method', function() {
      expect(scope.isItemActive).toBeDefined();
    });

    describe('contains an item object which', function() {

      var item;
      beforeEach(function() {
        item = scope.itemsList[0];
      });

      it('should be defined', function() {
        expect(item).toBeDefined();
      });

      it('should have an id property and is a string', function() {
        expect(item.id).toBeDefined();
        expect(item.id).toEqual(jasmine.any(String));
      });

      it('should have an itemCode property and is a string',
        function() {
          expect(item.itemCode).toBeDefined();
          expect(item.itemCode).toEqual(jasmine.any(String));
        });

      it('should have an itemName property and is a string',
        function() {
          expect(item.itemName).toBeDefined();
          expect(item.itemName).toEqual(jasmine.any(String));
        });

      it('should have an itemTypeId property and is a number',
        function() {
          expect(item.itemTypeId).toBeDefined();
          expect(item.itemTypeId).toEqual(jasmine.any(Number));
        });

      it('should have an categoryName property and is a string',
        function() {
          expect(item.categoryName).toBeDefined();
          expect(item.categoryName).toEqual(jasmine.any(String));
        });

    });

  });

  describe('searchRecords', function() {
    beforeEach(function() {
      scope.searchRecords();
    });

    it('should be defined', function() {
      expect(scope.searchRecords).toBeDefined();
    });

    it('should be called if initialized', function() {
      expect(scope.searchRecords).toHaveBeenCalled();
    });

    it('should call this.getItemsList', function() {
      expect(StockOwnerItemListCtrl.getItemsList).toHaveBeenCalled();
    });

    it('should call this.displayLoadingModal', function() {
      expect(StockOwnerItemListCtrl.displayLoadingModal).toHaveBeenCalled();
    });

    it('should clear existing item list', function() {
      var existingItemListCount = scope.itemsList.length;
      scope.searchRecords();
      expect(scope.itemsList.length).toBe(existingItemListCount);
    });

  });

  describe('remove item functionality', function() {

    it('should have a removeRecord() method attached to the scope',
      function() {
        expect(scope.removeRecord).toBeDefined();
      });

    it('should remove the item from the itemList', function() {
      var length = scope.itemsList.length;
      scope.removeRecord(332);
      expect(scope.itemsList.length).toEqual(length - 1);
    });

  });

  describe('clearSearchFilters functionality', function() {

    beforeEach(function() {
      scope.dateRange = {};
      scope.dateRange.startDate = 'testDate';
      scope.dateRange.endDate = 'testDate';
      scope.itemsList = ['test'];
      scope.search = {
        test: 'test'
      };
    });

    it('should have cleared search', function() {
      scope.clearSearchFilters();
      expect(scope.search).toEqual({});
    });

    it('should have cleared startDate', function() {
      scope.clearSearchFilters();
      expect(scope.dateRange.startDate).toEqual('');
    });

    it('should have cleared endDate', function() {
      scope.clearSearchFilters();
      expect(scope.dateRange.endDate).toEqual('');
    });

    it('should have cleared itemsList', function() {
      scope.clearSearchFilters();
      expect(scope.itemsList).toEqual([]);
    });
  });

});
