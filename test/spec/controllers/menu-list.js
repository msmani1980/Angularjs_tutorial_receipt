'use strict';

describe('Controller: MenuListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MenuListCtrl,
    scope,
    getMenuListDeferred,
    menuService,
    menuListJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _menuService_) {
    menuListJSON = {
      'menus': [{
        'id': 1,
        'companyId': 2,
        'menuCode': 'fakeMenuCode',
        'menuName': 'fakeMenuName',
        'description': 'Cell Phone Chargers',
        'startDate': '2014-09-30',
        'endDate': '2017-10-02',
        'createdBy': null,
        'createdOn': '2014-09-26 16:10:41.126376',
        'updatedBy': 1,
        'updatedOn': '2015-01-13 19:08:47.439519',
        'menuItems': [
          {
            'id': 2,
            'itemId': 66,
            'itemName': 'iPhone Charger',
            'menuId': 1,
            'itemQty': 1000
          }, {
            'id': 1,
            'itemId': 51,
            'itemName': 'Android Charger',
            'menuId': 1,
            'itemQty': 100
          }]
      }]
    };
    scope = $rootScope.$new();
    getMenuListDeferred = $q.defer();
    getMenuListDeferred.resolve(menuListJSON);
    menuService = _menuService_;
    spyOn(menuService, 'getMenuList').and.returnValue(getMenuListDeferred.promise);
    MenuListCtrl = $controller('MenuListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Menu Management');
  });

  it('should get the menu list from API', function () {
    expect(menuService.getMenuList).toHaveBeenCalled();
  });

  describe('menuList in scope', function () {
    it('should attach a menuList after a API call to getMenuList', function () {
      expect(!!scope.menuList).toBe(true);
    });

    it('should have a menu name property', function () {
      expect(scope.menuList.menus[0].menuCode).toBe('fakeMenuCode');
    });

    it('should have an array of items', function () {
      expect(scope.menuList.menus[0].menuItems.length).toBeGreaterThan(0);
    });
  });
});
