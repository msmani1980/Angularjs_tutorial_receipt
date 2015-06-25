'use strict';

describe('The StockOwnerItemListCtrl controller', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json', 'served/item-types.json',
    'served/sales-categories.json'));

  var StockOwnerItemListCtrl,
    scope,
    getItemsListDeferred,
    itemsService,
    itemsListJSON,
    getItemTypesListDeferred,
    itemTypesService,
    itemTypesJSON,
    getSalesCategoriesDeferred,
    salesCategoriesService,
    salesCategoriesJSON,
    location,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _itemsService_,
    _itemTypesService_, _salesCategoriesService_,
    $location, $httpBackend) {

    inject(function (_servedItemsList_, _servedItemTypes_,
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
    itemsService = _itemsService_;
    spyOn(itemsService, 'getItemsList').and.returnValue(
      getItemsListDeferred.promise);

    getItemTypesListDeferred = $q.defer();
    getItemTypesListDeferred.resolve(itemTypesJSON);
    itemTypesService = _itemTypesService_;
    spyOn(itemTypesService, 'getItemTypesList').and.returnValue(
      getItemTypesListDeferred.promise);

    getSalesCategoriesDeferred = $q.defer();
    getSalesCategoriesDeferred.resolve(salesCategoriesJSON);
    salesCategoriesService = _salesCategoriesService_;
    spyOn(salesCategoriesService, 'getSalesCategoriesList').and.returnValue(
      getSalesCategoriesDeferred.promise);

    spyOn(itemsService, 'removeItem').and.returnValue({
      then: function () {
        return;
      }
    });

    StockOwnerItemListCtrl = $controller('StockOwnerItemListCtrl', {
      $scope: scope
    });
    scope.$digest();

    spyOn(StockOwnerItemListCtrl, 'getItemsList');
    spyOn(StockOwnerItemListCtrl, 'getItemTypesList');
    spyOn(StockOwnerItemListCtrl, 'getSalesCategoriesList');

    StockOwnerItemListCtrl.getItemsList();
    StockOwnerItemListCtrl.getItemTypesList();
    StockOwnerItemListCtrl.getSalesCategoriesList();
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a getItemsList method', function () {
    expect(StockOwnerItemListCtrl.getItemsList).toBeDefined();
  });

  it('should call the getItemsList method', function () {
    expect(StockOwnerItemListCtrl.getItemsList).toHaveBeenCalled();
  });

  it('should have a getItemTypesList method', function () {
    expect(StockOwnerItemListCtrl.getItemTypesList).toBeDefined();
  });

  it('should call the getItemTypesList method', function () {
    expect(StockOwnerItemListCtrl.getItemTypesList).toHaveBeenCalled();
  });

  it('should have a getItemsList method', function () {
    expect(StockOwnerItemListCtrl.getItemsList).toBeDefined();
  });

  it('should call the getSalesCategoriesList method', function () {
    expect(StockOwnerItemListCtrl.getSalesCategoriesList).toHaveBeenCalled();
  });

  it('should have a parseStartDate method', function () {
    expect(StockOwnerItemListCtrl.parseStartDate).toBeDefined();
  });

  it('should have a parseEndDate method', function () {
    expect(StockOwnerItemListCtrl.parseEndDate).toBeDefined();
  });

  it('should have a filterItems method', function () {
    expect(StockOwnerItemListCtrl.filterItems).toBeDefined();
  });

  it('should have a sortItems method', function () {
    expect(StockOwnerItemListCtrl.sortItems).toBeDefined();
  });

  describe('The itemsList array', function () {

    it('should be attached to the scope', function () {
      expect(scope.itemsList).toBeDefined();
    });

    it('should have more than 1 item in the itemsList', function () {
      expect(scope.itemsList.length).toBeGreaterThan(1);
    });

    it('should match the response from the API', function () {
      expect(scope.itemsList).toEqual(itemsListJSON.retailItems);
    });

    describe('contains an item object which', function () {

      var item;
      beforeEach(function () {
        item = scope.itemsList[1];
      });

      it('should be defined', function () {
        expect(item).toBeDefined();
      });

      it('should have an id property and is a string', function () {
        expect(item.id).toBeDefined();
        expect(item.id).toEqual(jasmine.any(String));
      });

      it('should have an itemCode property and is a string',
        function () {
          expect(item.itemCode).toBeDefined();
          expect(item.itemCode).toEqual(jasmine.any(String));
        });

      it('should have an stockOwnerCode property and is a string',
        function () {
          expect(item.stockOwnerCode).toBeDefined();
          expect(item.stockOwnerCode).toEqual(jasmine.any(String));
        });

      it('should have an itemName property and is a string',
        function () {
          expect(item.itemName).toBeDefined();
          expect(item.itemName).toEqual(jasmine.any(String));
        });

      it('should have an itemTypeId property and is a number',
        function () {
          expect(item.itemTypeId).toBeDefined();
          expect(item.itemTypeId).toEqual(jasmine.any(Number));
        });

      it('should have an categoryName property and is a string',
        function () {
          expect(item.categoryName).toBeDefined();
          expect(item.categoryName).toEqual(jasmine.any(String));
        });

    });

  });

  describe('The Pagination', function () {

    it('should attach currentPage to the scope', function () {
      expect(scope.currentPage).toBeDefined();
      expect(scope.currentPage).toEqual(1);
    });

    it('should attach itemsPerPage to the scope', function () {
      expect(scope.itemsPerPage).toBeDefined();
      expect(scope.itemsPerPage).toEqual(10);
    });

    it('should attach currentPageInt to the scope', function () {
      expect(scope.currentPageInt).toBeDefined();
      expect(scope.currentPageInt).toEqual(1);
    });

    it('should attach itemsPerPageInt to the scope', function () {
      expect(scope.itemsPerPageInt).toBeDefined();
      expect(scope.itemsPerPageInt).toEqual(10);
    });

  });

});
