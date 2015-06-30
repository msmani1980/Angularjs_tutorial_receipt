'use strict';

/*global moment*/

describe('Controller: MenuEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menu.json', 'served/master-item-list.json'));

  var MenuEditCtrl,
    scope,
    $httpBackend,
    menuResponseJSON,
    masterItemsResponseJSON,
    itemsService,
    menuService;

  beforeEach(inject(function ($controller, $rootScope, $injector, _menuService_, _itemsService_) {
    scope = $rootScope.$new();
    inject(function (_servedMenu_, _servedMasterItemList_) {
      menuResponseJSON = _servedMenu_;
      masterItemsResponseJSON = _servedMasterItemList_;
    });

    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/menus/).respond(menuResponseJSON);
    $httpBackend.whenGET(/retail-items\/master/).respond(masterItemsResponseJSON);

    menuService = _menuService_;
    itemsService = _itemsService_;

    spyOn(menuService, 'getMenu').and.callThrough();
    spyOn(itemsService, 'getItemsList').and.callThrough();//returnValue(masterItemsResponseJSON);

    MenuEditCtrl = $controller('MenuEditCtrl', {
      $scope: scope
    });

    scope.menuEditForm = {
      $valid: true,
      $setPristine: function () {
      }
    };

    scope.$digest();
    $httpBackend.flush();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

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
          endDate: '20150531',
          fetchFromMaster: 'master'
        }, true);
      });
    });

    describe('item list on scope', function () {
      it('should attach a list of items to scope', function () {
        expect(!!scope.masterItemsList).toBe(true);
      });

      describe('menuItemList in scope', function () {
        it('should attach it to scope', function () {
          expect(!!scope.menuItemsList).toBe(true);
        });

        it('should have itemQty', function () {
          expect(!!scope.menuItemsList[0].itemQty).toBe(true);
        });

        it('should have a itemName', function () {
          expect(!!scope.menuItemsList[0].itemName).toBe(true);
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

      //it('should do a DELETE request to menuService with menuToDelete', function () {
      //  scope.showDeleteConfirmation({id: '1'});
      //  scope.deleteMenu();
      //  expect(menuService.deleteMenu).toHaveBeenCalled();
      //});
    });

  });
});
