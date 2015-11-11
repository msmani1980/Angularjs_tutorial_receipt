'use strict';

/*global moment*/

fdescribe('Controller: MenuEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menu.json', 'served/master-item-list.json', 'served/sales-categories.json'));

  var MenuEditCtrl,
    scope,
    menuResponseJSON,
    masterItemsResponseJSON,
    menuFactory,
    getMenuDeferred,
    getItemsListDeferred,
    salesCategoriesResponseJSON,
    salesCategoriesDeferred,
    createMenuDeffered;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedMenu_, _servedMasterItemList_, _servedSalesCategories_) {
      menuResponseJSON = _servedMenu_;
      masterItemsResponseJSON = _servedMasterItemList_;
      salesCategoriesResponseJSON = _servedSalesCategories_;
    });

    menuFactory = $injector.get('menuFactory');

    getMenuDeferred = $q.defer();
    getMenuDeferred.resolve(menuResponseJSON);

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(masterItemsResponseJSON);

    salesCategoriesDeferred = $q.defer();
    salesCategoriesDeferred.resolve(salesCategoriesResponseJSON);

    createMenuDeffered = $q.defer();

    spyOn(menuFactory, 'getMenu').and.returnValue(getMenuDeferred.promise);
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

  describe('general edit page', function () {

    it('should attach the view name', function () {
      expect(!!scope.viewName).toBe(true);
    });

    it('should get the menu list from API', function () {
      expect(menuFactory.getMenu).toHaveBeenCalled();
    });

    it('should attach a menu object after a API call to getMenu', function () {
      expect(!!scope.menu).toBe(true);
    });

    it('should have an array of items', function () {
      expect(scope.menu.menuItems.length).toBeGreaterThan(0);
    });

    describe('getItemsList API', function () {
      it('should get the items list from service', function () {
        expect(menuFactory.getItemsList).toHaveBeenCalled();
      });
    });

    describe('masterItemsList', function () {
      it('should have copied item name to menu.menuItems', function () {
        expect(scope.menu.menuItems[0].itemName).toBeDefined();
      });
    });

    describe('getSalesCategoriesList API', function () {
      it('should call getSalesCategories during init', function () {
        expect(menuFactory.getSalesCategoriesList).toHaveBeenCalled();
      });
    });

    describe('filterItems', function () {
      beforeEach(function() {
        scope.menu = {
          startDate: '08/20/2001',
          endDate: '09/25/2002'
        };
        scope.newItemList = [{itemName: 'test'}, {itemName: 'test2'}];
        scope.selectedCategories = [{id: 1}];
      });
      it('should be defined', function () {
        expect(menuFactory.getItemsList).toBeDefined();
      });
      it('should call getItems with categoryId', function () {
        var expectedPayload = {
          startDate: scope.menu.startDate,
          endDate: scope.menu.endDate,
          categoryId: scope.selectedCategories[0].id
        };
        scope.updateItemsList(0);
        expect(menuFactory.getItemsList).toHaveBeenCalledWith(expectedPayload, true);
      });

      it('should clear selected Items', function () {
        var oldSelectedValue = scope.menuItemList[0];
        scope.updateItemsList(0);
        expect(scope.menuItemList[0]).not.toEqual(oldSelectedValue);
        expect(scope.menuItemList[0]).toEqual(null);
      });

      it('should attach new response to itemsCollection', function () {
        scope.itesmsCollection = [{}];
        scope.updateItemsList(0);
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
        scope.menu = {startDate: futureString};
        expect(scope.isMenuEditable()).toBe(true);
      });
      it('should not allow editing for dates in the future', function () {
        scope.menu = {startDate: pastString};
        expect(scope.isMenuEditable()).toBe(false);
      });
      it('should allow deleting for editable menus with more than one item', function () {
        scope.menu = {
          startDate: futureString,
          menuItems: [{itemCode: 1}, {itemCode: 2}]
        };
        expect(scope.canDeleteItems()).toBe(true);
      });
      it('should allow deleting for editable menus with less than two item', function () {
        scope.menu = {
          startDate: futureString,
          menuItems: [{itemCode: 1}]
        };
        expect(scope.canDeleteItems()).toBe(false);
      });
    });

    describe('Delete items from Menu', function () {

    });

    describe('Adding items to Menu', function () {
      it('should push objects to newItemList on addItem()', function () {
        var previousLength = scope.menuItemList.length;
        scope.addItem();
        expect(scope.menuItemList.length).toBe(previousLength + 1);
      });

      it('should push a new items array for each item', function () {
        var previousLength = scope.filteredItemsCollection.length;
        scope.addItem();
        expect(scope.filteredItemsCollection.length).toBe(previousLength+1);
      });

      it('should have a newItemList attached to scope', function () {
        expect(!!scope.menuItemList).toBe(true);
      });

      it('should have a deleteNewItem attached to scope', function () {
        expect(!!scope.deleteNewItem).toBe(true);
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

      describe('the error handler', function () {

        var mockError = {
          status:400,
          statusText: 'Bad Request',
          response: {
            field:'menu date',
            code: '024'
          }
        };

        beforeEach(function() {
          scope.submitForm();
          createMenuDeffered.reject(mockError);
          scope.$apply();
        });

        it('should set the displayError flag to true', function() {
          expect(scope.displayError).toBeTruthy();
        });

        it('should set the errorResponse variable to API response', function() {
          expect(scope.errorResponse).toEqual(mockError);
        });

      });

      describe('new Items', function () {
        beforeEach(function () {
          scope.addItem();
          scope.menuItemList[0] = {
            'itemQty': 1979,
            'id': 1005
          };
        });

        it('should set newItems to be empty initially', function () {
          expect(scope.menuItemList.length).toEqual(2);
        });

        it('should newItems in payload not to have id or itemId', function () {
          expect(scope.menuItemList[1]).toEqual(null);
        });
      });

      describe('create menuItems payload', function () {

        beforeEach(function () {
          scope.menu.id = 2;
          scope.menuItemList = [{
            'itemQty': 1979,
            'id': 1005,
            'itemId': 123
          }, {
            'itemQty': 1979,
            'id': 1005
          }, {}];
        });

        it('should not add items that have not been set', function () {
          scope.menuItemList[2] = {itemQty: 2};
          var currentLength = scope.menuItemList.length;
          expect(MenuEditCtrl.createPayload().menuItems.length).toEqual(currentLength - 1);
        });

        it('should not add items that have no quantity', function () {
          scope.menuItemList[2] = {id: 2};
          var currentLength = scope.menuItemList.length;
          expect(MenuEditCtrl.createPayload().menuItems.length).toEqual(currentLength - 1);
        });

        it('should set menuId if menuId exists', function () {
          expect(MenuEditCtrl.createPayload().menuItems[0].menuId).toBeDefined();
          expect(MenuEditCtrl.createPayload().menuItems[1].menuId).toBeDefined();
        });

        it('should not change itemId and id if itemId has already been set', function () {
          var expectedItem = scope.menuItemList[0];
          expectedItem.menuId = scope.menu.id;
          expect(MenuEditCtrl.createPayload().menuItems[0]).toEqual(expectedItem);
        });

        it('should set itemId for items with no id', function () {
          var expectedItem = {
            itemQty: scope.menuItemList[1].itemQty,
            itemId: scope.menuItemList[1].id,
            menuId: scope.menu.id
          };
          expect(MenuEditCtrl.createPayload().menuItems[1]).toEqual(expectedItem);
        });
      });


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
        scope.overwriteMenu();
        expect(menuFactory.updateMenu).toHaveBeenCalled();
      });
    });
  });

})
;
