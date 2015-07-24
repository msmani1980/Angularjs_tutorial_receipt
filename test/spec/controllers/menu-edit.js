'use strict';

/*global moment*/

describe('Controller: MenuEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menu.json', 'served/master-item-list.json'));

  var MenuEditCtrl,
    scope,
    menuResponseJSON,
    masterItemsResponseJSON,
    menuFactory,
    getMenuDeferred,
    getItemsListDeferred;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedMenu_, _servedMasterItemList_) {
      menuResponseJSON = _servedMenu_;
      masterItemsResponseJSON = _servedMasterItemList_;
    });

    menuFactory = $injector.get('menuFactory');

    getMenuDeferred = $q.defer();
    getMenuDeferred.resolve(menuResponseJSON);

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(masterItemsResponseJSON);

    spyOn(menuFactory, 'getMenu').and.returnValue(getMenuDeferred.promise);
    spyOn(menuFactory, 'updateMenu').and.returnValue(getMenuDeferred.promise);
    spyOn(menuFactory, 'createMenu').and.returnValue(getMenuDeferred.promise);
    spyOn(menuFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
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

    describe('Delete items from Menu', function () {
      it('should have a confirmDelete function', function () {
        expect(!!scope.showDeleteConfirmation).toBe(true);
      });

      it('should attach itemToDelete to scope', function () {
        scope.showDeleteConfirmation({itemName: 'itemToDelete'});
        expect(scope.itemToDelete.itemName).toBe('itemToDelete');
      });
    });

    describe('Adding items to Menu', function () {
      it('should push objects to newItemList on addItem()', function () {
        var previousLength = scope.newItemList.length;
        scope.addItem();
        expect(scope.newItemList.length).toBe(previousLength + 1);
      });

      it('should have a newItemList attached to scope', function () {
        expect(!!scope.newItemList).toBe(true);
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

      describe('new Items', function () {

        beforeEach(function () {
          scope.addItem();
          scope.newItemList[0] = {
            'itemQty': 1979,
            'masterItem': {
              'id': 1005
            }
          };
        });

        it('should add newItems to payload on createPayload', function () {
          expect(MenuEditCtrl.createPayload().menuItems.length).toBe(2);
        });

        it('should newItems in payload not to have id', function () {
          expect(MenuEditCtrl.createPayload().menuItems[1].id).not.toBeDefined();
        });

        it('should not add new item to payload if new Item not valid', function () {
          scope.addItem();
          scope.newItemList[scope.newItemList.length - 1] = {
            fakeMenu: 'notValidData'
          };
          expect(MenuEditCtrl.createPayload().menuItems.length).toBe(2);
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

    it('should not be readOnly', function() {
      expect(scope.isMenuReadOnly()).toBe(false);
    });

    it('should be editable', function() {
      expect(scope.isMenuEditable()).toBe(true);
    });

    describe('submit form', function () {
      it('should call create Menu when form is valid', function () {
        scope.menuEditForm.$valid = true;
        scope.submitForm();
        expect(menuFactory.createMenu).toHaveBeenCalled();
      });
      it('should call update menu when creating a duplicate', function () {
        // TODO!
      });
    });
  });

})
;
