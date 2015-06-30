'use strict';

/*global moment*/

describe('Controller: MenuEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menu.json', 'served/master-item-list.json'));

  var MenuEditCtrl,
    scope,
    menuResponseJSON,
    masterItemsResponseJSON,
    itemsService,
    menuService,
    getMenuDeferred,
    getItemsListDeferred;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedMenu_, _servedMasterItemList_) {
      menuResponseJSON = _servedMenu_;
      masterItemsResponseJSON = _servedMasterItemList_;
    });

    menuService = $injector.get('menuService');
    itemsService = $injector.get('itemsService');

    getMenuDeferred = $q.defer();
    getMenuDeferred.resolve(menuResponseJSON);

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(masterItemsResponseJSON);

    spyOn(menuService, 'getMenu').and.returnValue(getMenuDeferred.promise);
    spyOn(menuService, 'updateMenu').and.returnValue(getMenuDeferred.promise);
    spyOn(itemsService, 'getItemsList').and.returnValue(getItemsListDeferred.promise);

    MenuEditCtrl = $controller('MenuEditCtrl', {
      $scope: scope
    });

    scope.menuEditForm = {
      $valid: true,
      $setDirty: jasmine.createSpy('$setDirty'),
      $setPristine: jasmine.createSpy('$setPristine')
    };

    scope.$digest();
  }));

  it('should attach the view name', function () {
    expect(!!scope.viewName).toBe(true);
  });



  describe('menu object in scope', function () {
    it('should get the menu list from API', function () {
      expect(menuService.getMenu).toHaveBeenCalled();
    });

    it('should attach a menu object after a API call to getMenu', function () {
      expect(!!scope.menu).toBe(true);
    });

    it('should have an array of items', function () {
      expect(scope.menu.menuItems.length).toBeGreaterThan(0);
    });

    it('should have date formatted to local', function () {
      expect(scope.menu.endDate).toBe('05/31/2015');
    });

    describe('getItemsList API', function () {

      it('should get the items list from service', function () {
        expect(itemsService.getItemsList).toHaveBeenCalled();
      });

      it('should restrict to start and end dates only', function () {
        expect(itemsService.getItemsList).toHaveBeenCalledWith({
          startDate: '20150501',
          endDate: '20150531'
        }, true);
      });
    });

    describe('masterItemsList', function () {
      it('should have copied item name to menu.menuItems', function () {
        expect(scope.menu.menuItems[0].itemName).toBeDefined();
      });
    });
  });

  describe('isMenuReadOnly', function () {
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

});
