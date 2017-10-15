'use strict';
/*global moment*/

describe('Controller: MenuEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menu.json'));
  beforeEach(module('served/menus.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/sales-categories.json'));

  var MenuEditCtrl;
  var scope;
  var menuResponseJSON;
  var menusResponseJSON;
  var masterItemsResponseJSON;
  var menuFactory;
  var getMenuDeferred;
  var getMenuListDeferred;
  var getItemsListDeferred;
  var salesCategoriesResponseJSON;
  var salesCategoriesDeferred;
  var createMenuDeffered;
  var httpBackend;
  var dateUtility;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedMenu_, _servedMenus_, _servedMasterItemList_, _servedSalesCategories_) {
      menuResponseJSON = _servedMenu_;
      menusResponseJSON = _servedMenus_;
      masterItemsResponseJSON = _servedMasterItemList_;
      salesCategoriesResponseJSON = _servedSalesCategories_;
    });

    httpBackend = $injector.get('$httpBackend');
    menuFactory = $injector.get('menuFactory');
    dateUtility = $injector.get('dateUtility');

    getMenuDeferred = $q.defer();
    getMenuListDeferred = $q.defer();
    getItemsListDeferred = $q.defer();
    salesCategoriesDeferred = $q.defer();
    createMenuDeffered = $q.defer();

    spyOn(menuFactory, 'getMenu').and.returnValue(getMenuDeferred.promise);
    spyOn(menuFactory, 'getMenuList').and.returnValue(getMenuListDeferred.promise);
    spyOn(menuFactory, 'updateMenu').and.returnValue(createMenuDeffered.promise);
    spyOn(menuFactory, 'createMenu').and.returnValue(createMenuDeffered.promise);
    spyOn(menuFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
    spyOn(menuFactory, 'getSalesCategoriesList').and.returnValue(salesCategoriesDeferred.promise);
    spyOn(menuFactory, 'getCompanyId');

    var routeParams = {
      id: 1,
      state: 'edit'
    };

    MenuEditCtrl = $controller('MenuEditCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    scope.menuEditForm = {
      $valid: true,
      $setDirty: jasmine.createSpy('$setDirty'),
      $setPristine: jasmine.createSpy('$setPristine')
    };

    scope.$digest();
  }));

  function resolveInitDependencies() {
    httpBackend.expectGET(/./).respond(200);
    getItemsListDeferred.resolve(masterItemsResponseJSON);
    getMenuDeferred.resolve(menuResponseJSON);
    getMenuListDeferred.resolve(menusResponseJSON);
    salesCategoriesDeferred.resolve(salesCategoriesResponseJSON);
    scope.$apply();
  }

  describe('general edit init', function () {
    beforeEach(function () {
      resolveInitDependencies();
    });

    it('should attach the view name', function () {
      expect(!!scope.viewName).toBe(true);
    });

    describe('API init', function () {
      it('should get the menu list from API', function () {
        expect(menuFactory.getMenu).toHaveBeenCalled();
      });

      it('should call getSalesCategories', function () {
        expect(menuFactory.getSalesCategoriesList).toHaveBeenCalled();
      });

      it('should call getMasterItems', function () {
        expect(menuFactory.getItemsList).toHaveBeenCalled();
      });
    });

    describe('data deserialization', function () {
      it('should attach a menu object after a API call to getMenu', function () {
        expect(!!scope.menu).toBe(true);
      });

      it('should attach menu items to scope', function () {
        var menuItemQtyFromMockResponse = menuResponseJSON.menuItems[0].itemQty;
        expect(scope.menuItemList.length > 0).toEqual(true);
        expect(scope.menuItemList[0].itemQty).toEqual(menuItemQtyFromMockResponse);
        expect(scope.menuItemList[0].selectedItem).toBeDefined();
      });
    });
  });

  describe('filterItems', function () {
    beforeEach(function () {
      scope.menu = {
        startDate: '08/20/2001',
        endDate: '09/25/2002'
      };
      scope.menuItemList = [{
        itemName: 'test'
      }, {
        itemName: 'test2'
      }];
      scope.selectedCategories = [{
        id: 1
      }];
    });

    it('should call getItems with categoryId', function () {
      var expectedPayload = {
        startDate: scope.menu.startDate,
        endDate: scope.menu.endDate,
        categoryId: scope.selectedCategories[0].id
      };
      scope.filterItemListByCategory(0);
      expect(menuFactory.getItemsList).toHaveBeenCalledWith(expectedPayload, true);
    });

    it('should attach new item list to filteredItemsCollection', function () {
      scope.filteredItemsCollection = [{}];
      scope.filterItemListByCategory(0);
      expect(scope.filteredItemsCollection[0]).not.toEqual({});
    });
  });

  describe('isMenuReadOnly', function () {

    it('should have a function to determine if page is viewOnly', function () {
      expect(scope.isViewOnly).toBeDefined();
    });

    it('should have a isMenuReadOnly function', function () {
      expect(!!scope.isMenuReadOnly).toBe(true);
    });

    it('should return true if startDate < today > endDate', function () {
      scope.menu.startDate = moment().subtract(1, 'month').format('L').toString();
      scope.menu.endDate = moment().subtract(2, 'month').format('L').toString();
      expect(scope.isMenuReadOnly()).toBe(true);
    });

    it('should return true if startDate < today < endDate', function () {
      scope.menu.startDate = moment().subtract(1, 'month').format('L').toString();
      scope.menu.endDate = moment().add(2, 'month').format('L').toString();
      expect(scope.isMenuReadOnly()).toBe(true);
    });

    it('should return false if startDate > today > endDate', function () {
      scope.menu.startDate = moment().add(1, 'month').format('L').toString();
      scope.menu.endDate = moment().add(2, 'month').format('L').toString();
      expect(scope.isMenuReadOnly()).toBe(false);
    });

    it('should return false if menu === null or undefined', function () {
      delete scope.menu;
      expect(scope.isMenuReadOnly()).toBe(false);
    });
  });

  describe('can edit or delete item', function () {
    var pastString = '05/10/1999';
    var futureString = '10/12/2050';

    it('should allow editing for dates in the future', function () {
      scope.menu = {
        startDate: futureString
      };
      expect(scope.isMenuEditable()).toBe(true);
    });

    it('should not allow editing for dates in the future', function () {
      scope.menu = {
        startDate: pastString
      };
      expect(scope.isMenuEditable()).toBe(false);
    });
  });

  describe('filterAllItemLists', function () {
    beforeEach(function () {
      spyOn(scope, 'filterAllItemLists').and.callThrough();
      scope.menu = {
        startDate: '10/20/2050',
        endDate: '10/25/2050'
      };
      scope.filteredItemsCollection[0] = masterItemsResponseJSON.masterItems;
    });

    it('should flag selected items', function () {
      scope.addItem();
      scope.menuItemList[0].selectedItem = { id: masterItemsResponseJSON.masterItems[0].id };
      scope.filterAllItemLists();
      expect(scope.filteredItemsCollection[0][0].selected).toEqual(true);
      expect(scope.filteredItemsCollection[0][1].selected).toEqual(false);
    });
  });

  describe('shouldDisableItem', function () {

    it('should not disabled if given row contains items to select', function () {
      scope.filteredItemsCollection = [masterItemsResponseJSON.masterItems];
      expect(scope.shouldDisableItemSelect(0)).toEqual(false);
    });

    it('should be disabled if given row does not contain items to select', function () {
      scope.filteredItemsCollection = [null];
      expect(scope.shouldDisableItemSelect(0)).toEqual(true);
    });
  });

  describe('Delete items from Menu', function () {
    beforeEach(function () {
      spyOn(scope, 'filterAllItemLists');
      scope.menu = {
        startDate: '10/20/2050',
        endDate: '10/25/2050'
      };
    });

    it('should call setAvailableItems after deletion', function () {
      scope.addItem();
      scope.removeItem(0);
      expect(scope.filterAllItemLists).toHaveBeenCalled();
    });

    it('should clear the item after deletion', function () {
      scope.addItem();
      scope.removeItem(0);
      expect(scope.menuItemList.length).toEqual(0);
      expect(scope.selectedCategories.length).toEqual(0);
      expect(scope.filteredItemsCollection.length).toEqual(0);
    });

    it('should readjust recorded indicies', function () {
      scope.addItem();
      scope.addItem();
      scope.addItem();
      scope.removeItem(1);
      expect(scope.menuItemList[1].menuIndex).toEqual(1);
    });

  });

  describe('Adding items to Menu', function () {
    beforeEach(function () {
      scope.menu = {
        startDate: '10/20/2050',
        endDate: '10/25/2050'
      };
    });

    it('should push objects to menuItemList on addItem()', function () {
      var previousLength = scope.menuItemList.length;
      scope.addItem();
      expect(scope.menuItemList.length).toBe(previousLength + 1);
    });

    it('should push a new items array for each item', function () {
      var previousLength = scope.filteredItemsCollection.length;
      scope.addItem();
      expect(scope.filteredItemsCollection.length).toBe(previousLength + 1);
    });

    it('should push a new null selected category for each item', function () {
      var previousLength = scope.selectedCategories.length;
      scope.addItem();
      expect(scope.selectedCategories.length).toBe(previousLength + 1);
      expect(scope.selectedCategories[previousLength]).toEqual(null);
    });

    it('should have a menuItemList attached to scope', function () {
      expect(!!scope.menuItemList).toBe(true);
    });
  });

  describe('Submit Form', function () {

    it('should not submit if form is invalid', function () {
      scope.menuEditForm.$valid = false;
      scope.submitForm();
      expect(menuFactory.updateMenu).not.toHaveBeenCalled();
    });

    it('should submit if form is valid', function () {
      scope.submitForm();
      expect(menuFactory.updateMenu).toHaveBeenCalled();
    });
  });

  describe('the error handler', function () {

    var mockError = {
      status: 400,
      statusText: 'Bad Request',
      response: {
        field: 'menu date',
        code: '024'
      }
    };

    beforeEach(function () {
      scope.submitForm();
      createMenuDeffered.reject(mockError);
      scope.$apply();
    });

    it('should set the displayError flag to true', function () {
      expect(scope.displayError).toBeTruthy();
    });

    it('should set the errorResponse variable to API response', function () {
      expect(scope.errorResponse).toEqual(mockError);
    });

  });

  describe('create menuItems payload', function () {
    beforeEach(function () {
      scope.menu.id = 2;
      scope.menuItemList = [{
        itemQty: 1979,
        id: 1005,
        selectedItem: {
          id: 123
        }
      }, {
        itemQty: 1979,
        selectedItem: {
          id: 234
        }
      }, {}];
    });

    it('should not add items that have not been set', function () {
      var currentLength = scope.menuItemList.length;
      expect(MenuEditCtrl.createPayload().menuItems.length).toEqual(currentLength - 1);
    });

    it('should not add items that have no quantity', function () {
      scope.menuItemList[2] = {
        id: 2,
        selectedItem: {
          id: 123
        }
      };
      var currentLength = scope.menuItemList.length;
      expect(MenuEditCtrl.createPayload().menuItems.length).toEqual(currentLength - 1);
    });

    it('should set menuId if menuId exists', function () {
      expect(MenuEditCtrl.createPayload().menuItems[0].menuId).toEqual(scope.menu.id);
      expect(MenuEditCtrl.createPayload().menuItems[1].menuId).toEqual(scope.menu.id);
    });

    it('should set item id if it exists', function () {
      scope.menuItemList[0].id = 123;
      expect(MenuEditCtrl.createPayload().menuItems[0].id).toEqual(123);
    });

    it('should set itemId and qty for all item payloads', function () {
      scope.menu.id = null;
      var expectedItem = {
        itemQty: scope.menuItemList[1].itemQty,
        itemId: scope.menuItemList[1].selectedItem.id
      };
      expect(MenuEditCtrl.createPayload().menuItems[1]).toEqual(expectedItem);
      expect(MenuEditCtrl.createPayload().menuItems[1].itemQty).toBeDefined();
      expect(MenuEditCtrl.createPayload().menuItems[1].itemQty).not.toBeNull();
    });
  });


  describe('create page', function () {
    var routeParams = {
      state: 'create'
    };
    beforeEach(inject(function ($controller) {
      MenuEditCtrl = $controller('MenuEditCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
      resolveInitDependencies();
    }));

    describe('initialization', function () {
      it('should call get company Id', function () {
        expect(menuFactory.getCompanyId).toHaveBeenCalled();
      });

      it('should attach a menu object to scope', function () {
        expect(scope.menu).toBeDefined();
      });
    });

    it('should not be readOnly', function () {
      expect(scope.isMenuReadOnly()).toBe(false);
    });

    it('should be editable', function () {
      expect(scope.isMenuEditable()).toBe(true);
    });

    it('should not be viewOnly', function () {
      expect(scope.isViewOnly()).toBe(false);
    });

    describe('submit form', function () {
      it('should call updateMenu on overwrite', function () {
        scope.menuToOverwrite = { id: 1, menuId: 2 };
        scope.overwriteMenu();
        expect(menuFactory.updateMenu).toHaveBeenCalled();
      });
    });
  });

  describe('check overwrite or create', function () {
    beforeEach(inject(function ($controller) {
      var routeParams = {
        id: 1,
        state: 'edit'
      };

      MenuEditCtrl = $controller('MenuEditCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should check for duplicates', function () {
      getMenuListDeferred.resolve(menusResponseJSON);
      MenuEditCtrl.createMenu();
      expect(menuFactory.getMenuList).toHaveBeenCalled();
    });

    it('should allow overwrite if duplicate exists and date is in the future', function () {
      var mockFutureResponse = {menus: [{
        startDate: '10/20/2050',
        endDate: '12/20/2055',
        id: 123
      }]};
      getMenuListDeferred.resolve(mockFutureResponse);
      MenuEditCtrl.createMenu();
      scope.$digest();
      expect(scope.menuToOverwrite).toBeDefined();
      expect(scope.menuToOverwrite.id).toEqual(123);
    });

    it('should automatically save if no duplicate exists', function () {
      getMenuListDeferred.resolve([]);
      MenuEditCtrl.createMenu();
      expect(menuFactory.getMenuList).toHaveBeenCalled();
    });
  });

});
