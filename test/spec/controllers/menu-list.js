'use strict';

/*global moment*/
describe('Controller: MenuListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json'));

  var MenuListCtrl,
    scope,
    getMenuListDeferred,
    menuService,
    menuListJSON,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _menuService_, $location) {
    inject(function (_servedMenus_) {
      menuListJSON = _servedMenus_;
    });
    location = $location;
    scope = $rootScope.$new();
    getMenuListDeferred = $q.defer();
    getMenuListDeferred.resolve(menuListJSON);
    menuService = _menuService_;
    spyOn(menuService, 'getMenuList').and.returnValue(getMenuListDeferred.promise);
    spyOn(menuService, 'deleteMenu');
    MenuListCtrl = $controller('MenuListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Menu Management');
  });

  it('should clear search model and make a API call', function () {
    scope.search = {startDate: 'fakeDate'};
    scope.clearForm();
    expect(scope.search.startDate).toBe(undefined);
    expect(menuService.getMenuList).toHaveBeenCalledWith({});
  });

  it('should clear search model and make a API call', function () {
    scope.search = {startDate: '10/05/1979'};
    scope.searchMenus();
    expect(menuService.getMenuList).toHaveBeenCalledWith({startDate: '19791005'});
  });

  it('should get the menu list from API', function () {
    expect(menuService.getMenuList).toHaveBeenCalled();
  });

  describe('menuList in scope', function () {
    it('should attach a menuList after a API call to getMenuList', function () {
      expect(!!scope.menuList).toBe(true);
    });

    it('should have a menu name property', function () {
      expect(scope.menuList[0].menuCode).toBe('Test01');
    });

    it('should have an array of items', function () {
      expect(scope.menuList[0].menuItems.length).toBeGreaterThan(0);
    });

    it('should have a formatted start and date', function () {
      expect(scope.menuList[0].startDate).toBe('04/15/2015');
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
      scope.showMenu({id: 1});
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
      fakeMenuItem.endDate = moment().subtract(1, 'month').format('L').toString();
      expect(scope.isMenuReadOnly(fakeMenuItem)).toBe(true);
    });

    it('should have a confirmDelete function', function () {
      expect(!!scope.confirmDelete).toBe(true);
    });

    it('should attach menuToDelete to scope', function () {
      scope.showDeleteConfirmation({name:'menuToDelete'});
      expect(scope.menuToDelete.name).toBe('menuToDelete');
    });

    it('should do a DELETE requesto to menuService with menuToDelete', function () {
      scope.showDeleteConfirmation({id:'1'});
      scope.deleteMenu();
      expect(menuService.deleteMenu).toHaveBeenCalled();
    });

  });
});
