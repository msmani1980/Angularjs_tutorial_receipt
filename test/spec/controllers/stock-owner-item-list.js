'use strict';

describe('Controller: StockOwnerItemListCtrl', function () {

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
  }));

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

  });
  /*it('should clear search model and make a API call', function () {
    scope.search = {
      startDate: 'fakeDate'
    };
    scope.clearForm();
    expect(scope.search.startDate).toBe(undefined);
    expect(itemsService.getItemsList).toHaveBeenCalledWith({});
  });

  it('should clear search model and make a API call', function () {
    scope.search = {
      startDate: '10/05/1979'
    };
    scope.searchMenus();
    expect(itemsService.getItemsList).toHaveBeenCalledWith({
      startDate: '19791005'
    });
  });

  it('should get the menu list from API', function () {
    expect(itemsService.getItemsList).toHaveBeenCalled();
  });
  */
  /*describe('itemsList in scope', function () {
    it('should attach a itemsList after a API call to getItemsList',
      function () {
        expect(!!scope.itemsList).toBe(true);
      });

    it('should have a menu name property', function () {
      expect(scope.itemsList[0].menuCode).toBe('Test01');
    });

    it('should have an array of items', function () {
      expect(scope.itemsList[0].menuItems.length).toBeGreaterThan(0);
    });

    it('should have a formatted start and date', function () {
      expect(scope.itemsList[0].startDate).toBe('04/15/2015');
    });
  });
  */
  /*describe('Action buttons', function () {
    var fakeMenuItem;

    beforeEach(function () {
      fakeMenuItem = {
        endDate: moment().add(1, 'month').format('L').toString(),
        startDate: moment().format('L').toString()
      };
    });

    it('should change the url based on the menu object', function () {
      scope.showMenu({
        id: 1
      });
      scope.$digest();
      expect(location.path()).toBe('/menu-edit/1');
    });

    it('should have a isMenuReadOnly function', function () {
      expect(!!scope.isMenuReadOnly).toBe(true);
    });

    it('should return false if endDate > today', function () {
      expect(scope.isMenuReadOnly(fakeMenuItem)).toBe(false);
    });

    it('should return true if end date <= today', function () {
      fakeMenuItem.endDate = moment().subtract(1, 'month').format(
        'L').toString();
      expect(scope.isMenuReadOnly(fakeMenuItem)).toBe(true);
    });

    it('should have a confirmDelete function', function () {
      expect(!!scope.showDeleteConfirmation).toBe(true);
    });

    it('should attach menuToDelete to scope', function () {
      scope.showDeleteConfirmation({
        name: 'menuToDelete'
      });
      expect(scope.menuToDelete.name).toBe('menuToDelete');
    });

    it('should do a DELETE requesto to itemsService with menuToDelete',
      function () {
        scope.showDeleteConfirmation({
          id: '1'
        });
        scope.deleteMenu();
        expect(itemsService.deleteMenu).toHaveBeenCalled();
      });

  });*/
});
