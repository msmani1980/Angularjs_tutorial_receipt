'use strict';

describe('Service: menuService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json'));

  // instantiate service
  var menuService,
    $httpBackend,
    menuResponseJSON;
  beforeEach(inject(function (_menuService_, $injector) {
      inject(function (_servedMenus_) {
        menuResponseJSON = _servedMenus_;
      });

      $httpBackend = $injector.get('$httpBackend');
      menuService = _menuService_;
    })
  );

  it('should exist', function () {
    expect(!!menuService).toBe(true);
  });

  describe('API calls', function () {
    var menuData;

    describe('getMenuList', function () {
      beforeEach(function () {
        $httpBackend.whenGET(/menus/).respond(menuResponseJSON);
        menuService.getMenuList().then(function (menuListFromAPI) {
          console.log(menuListFromAPI);
          menuData = menuListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should fetch and return menuList', function () {
        $httpBackend.expectGET(/menus/);
      });

      it('should be an array', function () {
        expect(menuData.menus.length).toBeGreaterThan(0);
      });

      it('should have a menu name property', function () {
        expect(menuData.menus[0].menuCode).toBe('Test01');
      });

      it('should have an array of items', function () {
        expect(menuData.menus[0].menuItems.length).toBeGreaterThan(0);
      });
    });

    describe('search Menu', function () {
      it('should fetch and return menuList', function () {
        spyOn(menuService, 'getMenuList').and.callThrough();
        var payload = {someKey: 'someValue'};
        menuService.getMenuList(payload);
        expect(menuService.getMenuList).toHaveBeenCalledWith(payload);
      });
    });

    describe('getMenu', function () {
      beforeEach(function () {
        spyOn(menuService, 'getMenu').and.callFake(function () {
          return menuResponseJSON;
        });
        menuData = menuService.getMenu(1);
      });

      it('should fetch and return menuList', function () {
        $httpBackend.expectGET(/menus/);
      });
    });

    describe('updateMenu', function () {
      beforeEach(function () {
        $httpBackend.whenPUT(/menus/).respond({done: true});
      });
      it('it should POST data to menus API', function () {
        menuService.updateMenu({menuData: 'fakeMenuPayload'});
        $httpBackend.flush();
        $httpBackend.expectPUT(/menus/);
      });
    });

  });
});
