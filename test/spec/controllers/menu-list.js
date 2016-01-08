'use strict';

/*global moment*/
describe('Controller: MenuListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json'));

  var MenuListCtrl;
  var scope;
  var getMenuListDeferred;
  var menuService;
  var menuListJSON;
  var location;
  var deleteMenuDeffered;
  var httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _menuService_, $httpBackend,
    $location) {
    inject(function (_servedMenus_) {
      menuListJSON = _servedMenus_;
    });

    httpBackend = $httpBackend;
    location = $location;
    scope = $rootScope.$new();
    getMenuListDeferred = $q.defer();
    deleteMenuDeffered = $q.defer();
    getMenuListDeferred.resolve(menuListJSON);
    menuService = _menuService_;
    spyOn(menuService, 'getMenuList').and.returnValue(
      getMenuListDeferred.promise);
    spyOn(menuService, 'deleteMenu').and.returnValue(deleteMenuDeffered.promise);
    MenuListCtrl = $controller('MenuListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Menu Management');
  });

  it('should clear search model and make a API call', function () {
    scope.search = {
      startDate: 'fakeDate'
    };
    scope.clearForm();
    expect(scope.search.startDate).toBe(undefined);
    expect(menuService.getMenuList).toHaveBeenCalledWith({ limit: 100, offset: 0 });
  });

  it('should clear search model and make a API call', function () {
    scope.search = {
      startDate: '10/05/1979'
    };
    scope.searchMenus();
    expect(menuService.getMenuList).toHaveBeenCalledWith({
      startDate: '19791005',
      limit: 100, offset: 0
    });
  });

  it('should get the menu list from API', function () {
    scope.loadMenus();
    expect(menuService.getMenuList).toHaveBeenCalled();
  });

  describe('menuList in scope', function () {
    beforeEach(function() {
        scope.loadMenus();
        scope.$digest();
      });

    it('should attach a menuList after a API call to getMenuList',
      function () {
        expect(scope.menuList.length).toBeGreaterThan(1);
      });

    it('should have a menu name property', function () {
      expect(scope.menuList[0].menuCode).toBe('T1');
    });

    it('should have an array of items', function () {
      expect(scope.menuList[0].menuItems.length).toBeGreaterThan(0);
    });

    it('should have a formatted start and date', function () {
      expect(scope.menuList[0].startDate).toBe('05/06/2015');
    });
  });

  describe('Action buttons', function () {
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
      expect(location.path()).toBe('/menu/view/1');
    });

    describe('can user edit / delete menu', function () {
      it('should have a isMenuEditable function', function () {
        expect(!!scope.isMenuEditable).toBe(true);
      });

      it('should return true if menu is editable', function () {
        expect(scope.isMenuEditable(fakeMenuItem)).toBe(true);
      });

      it('should return false if menu is not editable', function () {
        fakeMenuItem.endDate = moment().subtract(1, 'month').format(
          'L').toString();
        expect(scope.isMenuEditable(fakeMenuItem)).toBe(false);
      });

      it('should have a isMenuReadOnly function', function () {
        expect(!!scope.isMenuReadOnly).toBe(true);
      });

      it('should return true if startDate < today > endDate',
        function () {
          fakeMenuItem.startDate = moment().subtract(1, 'month').format(
            'L').toString();
          fakeMenuItem.endDate = moment().subtract(2, 'month').format(
            'L').toString();
          expect(scope.isMenuReadOnly(fakeMenuItem)).toBe(true);
        });

      it('should return true if startDate < today < endDate',
        function () {
          fakeMenuItem.startDate = moment().subtract(1, 'month').format(
            'L').toString();
          fakeMenuItem.endDate = moment().add(2, 'month').format(
            'L').toString();
          expect(scope.isMenuReadOnly(fakeMenuItem)).toBe(true);
        });

      it('should return false if startDate > today > endDate',
        function () {
          fakeMenuItem.startDate = moment().add(1, 'month').format(
            'L').toString();
          fakeMenuItem.endDate = moment().add(2, 'month').format(
            'L').toString();
          expect(scope.isMenuReadOnly(fakeMenuItem)).toBe(false);
        });

      it('should return true if menu === null or undefined',
        function () {
          expect(scope.isMenuReadOnly(fakeMenuItem)).toBe(true);
        });
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

    it('should do a DELETE request to menuService with menuToDelete',
      function () {
        scope.showDeleteConfirmation({
          id: '1'
        });
        scope.deleteMenu();
        expect(menuService.deleteMenu).toHaveBeenCalled();
      });

    describe('the error handler', function () {

      var mockError = {
        status: 400,
        statusText: 'Bad Request',
        response: {
          field: 'bogan',
          code: '000'
        }
      };

      beforeEach(function() {
        httpBackend.expectGET(/./).respond(200);
        scope.showDeleteConfirmation({
          id: '10000000'
        });
        scope.deleteMenu();
        deleteMenuDeffered.reject(mockError);
        scope.$apply();
      });

      it('should set error data ', function () {
        expect(scope.errorResponse).toEqual(mockError);
      });

      it('should return false', function () {
        expect(scope.displayError).toBeTruthy();
      });

    });

  });
});
