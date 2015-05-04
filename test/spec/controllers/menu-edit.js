'use strict';

describe('Controller: MenuEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MenuEditCtrl,
    scope,
    menuResponseJSON,
    getMenuDeferred,
    menuService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _menuService_) {
    scope = $rootScope.$new();
    menuResponseJSON = {
      'id': 121,
      'companyId': 374,
      'menuCode': 'Test01',
      'menuName': 'Test Menu',
      'description': 'Test Menu',
      'startDate': '2015-04-15',
      'endDate': '2015-04-15',
      'createdBy': 1,
      'createdOn': '2015-04-14 02:49:35.715873',
      'updatedBy': null,
      'updatedOn': null,
      'menuItems': [{'id': 248, 'itemId': 331, 'itemQty': 1, 'menuId': 121, 'sortOrder': 1}]
    };
    getMenuDeferred = $q.defer();
    getMenuDeferred.resolve(menuResponseJSON);
    menuService = _menuService_;
    spyOn(menuService, 'getMenu').and.returnValue(getMenuDeferred.promise);
    MenuEditCtrl = $controller('MenuEditCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a list of awesomeThings to the scope', function () {
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
      expect(scope.menu.endDate).toBe('4/15/2015');
    });

  });
});
