'use strict';

// testing controller
describe('itemListCtrl', function() {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json', 'served/item-types.json',
    'served/sales-categories.json'));

  var ItemListCtrl,
    $scope,
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
    httpBackend,
    authRequestHandler;


  // Initialize the controller and a mock scope
  beforeEach(inject(function($q, $controller, $rootScope, _itemsService_,
    _itemTypesService_, _salesCategoriesService_,
    $location, $httpBackend) {

    inject(function(_servedItemsList_, _servedItemTypes_,
      _servedSalesCategories_) {
      itemsListJSON = _servedItemsList_;
      itemTypesJSON = _servedItemTypes_;
      salesCategoriesJSON = _servedSalesCategories_;
    });

    // backend definition common for all tests
    authRequestHandler = $httpBackend.when('GET', '/auth.py').respond({
      userId: 'userX'
    }, {
      'A-Token': 'xxx'
    });

    httpBackend = $httpBackend;
    location = $location;
    $scope = $rootScope.$new();

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
      then: function (callBack) {
        return callBack();
      }
    });

    ItemListCtrl = $controller('ItemListCtrl', {
      $scope: $scope
    });
    $scope.$digest();

    spyOn($scope, 'searchRecords');
    spyOn(ItemListCtrl, 'getItemsList');
    spyOn(ItemListCtrl, 'getItemTypesList');
    spyOn(ItemListCtrl, 'getSalesCategoriesList');
    spyOn(ItemListCtrl, 'generateItemQuery');
    spyOn(ItemListCtrl, 'displayLoadingModal');

    ItemListCtrl.getItemsList();
    ItemListCtrl.getItemTypesList();
    ItemListCtrl.getSalesCategoriesList();
    ItemListCtrl.generateItemQuery();
    ItemListCtrl.displayLoadingModal();
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a getItemsList method', function() {
    expect(ItemListCtrl.getItemsList).toBeDefined();
  });

  it('should call the getItemsList method', function() {
    expect(ItemListCtrl.getItemsList).toHaveBeenCalled();
  });

  it('should have a getItemTypesList method', function() {
    expect(ItemListCtrl.getItemTypesList).toBeDefined();
  });

  it('should call the getItemTypesList method', function() {
    expect(ItemListCtrl.getItemTypesList).toHaveBeenCalled();
  });

  it('should have a getItemsList method', function() {
    expect(ItemListCtrl.getItemsList).toBeDefined();
  });

  it('should call the getSalesCategoriesList method', function() {
    expect(ItemListCtrl.getSalesCategoriesList).toHaveBeenCalled();
  });

  it('should have a parseDate method', function() {
    expect(ItemListCtrl.parseDate).toBeDefined();
  });

  it('should have a filterItems method', function() {
    expect(ItemListCtrl.filterItems).toBeDefined();
  });

  it('should have a generateItemQuery method', function() {
    expect(ItemListCtrl.generateItemQuery).toBeDefined();
  });

  describe('The itemsList array', function() {

    it('should be attached to the scope', function() {
      expect($scope.itemsList).toBeDefined();
    });

    it('should have more than 1 item in the itemsList', function() {
      expect($scope.itemsList.length).toBeGreaterThan(1);
    });

    it('should match the response from the API', function() {
      expect($scope.itemsList).toEqual(itemsListJSON.retailItems);
    });

    it('should have a isItemActive method', function() {
      expect($scope.isItemActive).toBeDefined();
    });

    describe('contains an item object which', function() {
      var item;
      beforeEach(function() {
        item = $scope.itemsList[1];
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

      it('should have an stockOwnerCode property and is a string',
        function() {
          expect(item.stockOwnerCode).toBeDefined();
          expect(item.stockOwnerCode).toEqual(jasmine.any(String));
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

  describe('The Pagination', function() {

    it('should attach currentPage to the scope', function() {
      expect($scope.currentPage).toBeDefined();
      expect($scope.currentPage).toEqual(1);
    });

    it('should attach itemsPerPage to the scope', function() {
      expect($scope.itemsPerPage).toBeDefined();
      expect($scope.itemsPerPage).toEqual(10);
    });

    it('should attach currentPageInt to the scope', function() {
      expect($scope.currentPageInt).toBeDefined();
      expect($scope.currentPageInt).toEqual(1);
    });

    it('should attach itemsPerPageInt to the scope', function() {
      expect($scope.itemsPerPageInt).toBeDefined();
      expect($scope.itemsPerPageInt).toEqual(10);
    });

  });

  describe('searchRecords', function() {

    beforeEach(function() {
      $scope.searchRecords();
    });

    it('should be defined', function() {
      expect($scope.searchRecords).toBeDefined();
    });

    it('should be called if initialized', function() {
      expect($scope.searchRecords).toHaveBeenCalled();
    });

    it('should call this.getItemsList', function() {
      expect(ItemListCtrl.getItemsList).toHaveBeenCalled();
    });

    it('should call this.displayLoadingModal', function() {
      expect(ItemListCtrl.displayLoadingModal).toHaveBeenCalled();
    });

  });

  describe('remove item functionality', function () {

    it('should have a removeRecord() method attached to the scope',
      function () {
        expect($scope.removeRecord).toBeDefined();
      });

    it('should remove the record from the relationshipList', function () {
      expect($scope.itemsList.length).toEqual(17);
      $scope.removeRecord(332);
      expect($scope.itemsList.length).toEqual(16);
    });

  });

});
