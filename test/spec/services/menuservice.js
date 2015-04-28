'use strict';

describe('Service: menuService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuService,
    $httpBackend,
    menuResponseJSON;
  beforeEach(inject(function (_menuService_, $injector) {
    menuResponseJSON = {
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

    $httpBackend = $injector.get('$httpBackend');
    menuService = _menuService_;
  }));

  it('should exist', function () {
    expect(!!menuService).toBe(true);
  });

  describe('API calls', function () {
    var menuData;

    describe('getMenuList', function () {
      beforeEach(function () {
        $httpBackend.whenGET(/menus/).respond(menuResponseJSON);
        menuService.getMenuList().then(function(menuListFromAPI){
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
        expect(menuData.menus[0].menuCode).toBe('fakeMenuCode');
      });

      it('should have an array of items', function () {
        expect(menuData.menus[0].menuItems.length).toBeGreaterThan(0);
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
        $httpBackend.whenPUT(/menus/).respond({done:true});
      });
      it('it should POST data to menus API', function () {
        menuService.updateMenu({menuData: 'fakeMenuPayload'});
        $httpBackend.flush();
        $httpBackend.expectPUT(/menus/);
      });
    });

  });
});
