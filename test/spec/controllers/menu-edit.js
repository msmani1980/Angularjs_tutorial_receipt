'use strict';

describe('Controller: MenuEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menu.json'));

  var MenuEditCtrl,
    scope,
    $httpBackend,
    menuResponseJSON,
    menuService;

  beforeEach(inject(function ($controller, $rootScope, $injector, _menuService_) {
    scope = $rootScope.$new();
    inject(function (_servedMenu_) {
      menuResponseJSON = _servedMenu_;
    });

    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/menus/).respond(menuResponseJSON);
    menuService = _menuService_;

    spyOn(menuService, 'getMenu').and.callThrough();
    MenuEditCtrl = $controller('MenuEditCtrl', {
      $scope: scope
    });
    $httpBackend.flush();

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
      expect(scope.menu.endDate).toBe('04/15/2015');
    });

  });
});
