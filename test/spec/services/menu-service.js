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
    $httpBackend.whenGET(/menus/).respond(menuResponseJSON);
    menuService = _menuService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!menuService).toBe(true);
  });

  describe('API calls', function () {
    var menuData;

    describe('getMenuList', function () {
      beforeEach(function () {
        menuService.getMenuList().then(function (menuListFromAPI) {
          menuData = menuListFromAPI;
        });
        $httpBackend.flush();
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
        $httpBackend.flush();
        expect(menuService.getMenuList).toHaveBeenCalledWith(payload);
      });
    });

    describe('updateMenu', function () {
      beforeEach(function () {
        $httpBackend.whenPUT(/menus/).respond({done: true});
      });
      it('it should POST data to menus API', function () {
        menuService.updateMenu({menuData: 'fakeMenuPayload'});
        $httpBackend.expectPUT(/menus/);
        $httpBackend.flush();
      });
    });

    describe('deleteMenu', function () {
      beforeEach(function () {
        $httpBackend.whenDELETE(/menus/).respond({done: true});
      });
      it('it should DELETE data to menus API', function () {
        menuService.deleteMenu({menuData: 'fakeMenuPayload'});
        $httpBackend.expectDELETE(/menus/);
        $httpBackend.flush();
      });
    });

  });
});
