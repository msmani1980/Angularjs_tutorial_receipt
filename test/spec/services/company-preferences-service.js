'use strict';

describe('Service: companyPreferencesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-preferences.json'));


  // instantiate service
  var companyPreferencesService,
    $httpBackend,
    preferencesJSON;
  beforeEach(inject(function (_companyPreferencesService_, $injector) {
    inject(function (_servedCompanyPreferences_) {
      preferencesJSON = _servedCompanyPreferences_;
    });
    $httpBackend = $injector.get('$httpBackend');

    companyPreferencesService = _companyPreferencesService_;
  }));

  it('should exist', function () {
    expect(!!companyPreferencesService).toBe(true);
  });

  describe('API calls', function () {
    var apiData;

    describe('getMenuList', function () {
      beforeEach(function () {
        $httpBackend.whenGET(/company-preferences/).respond(preferencesJSON);
        companyPreferencesService.getList().then(function (menuListFromAPI) {
          apiData = menuListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should fetch and return menuList', function () {
        $httpBackend.expectGET(/menus/);
      });

      //  it('should be an array', function () {
      //    expect(apiData.menus.length).toBeGreaterThan(0);
      //  });
      //
      //  it('should have a menu name property', function () {
      //    expect(apiData.menus[0].menuCode).toBe('Test01');
      //  });
      //
      //  it('should have an array of items', function () {
      //    expect(apiData.menus[0].menuItems.length).toBeGreaterThan(0);
      //  });
      //});
      //
      //describe('search Menu', function () {
      //  it('should fetch and return menuList', function () {
      //    spyOn(companyPreferencesService, 'getMenuList').and.callThrough();
      //    var payload = {someKey: 'someValue'};
      //    companyPreferencesService.getMenuList(payload);
      //    expect(companyPreferencesService.getMenuList).toHaveBeenCalledWith(payload);
      //  });
      //});
      //
      //describe('getMenu', function () {
      //  beforeEach(function () {
      //    spyOn(companyPreferencesService, 'getMenu').and.callFake(function () {
      //      return menuResponseJSON;
      //    });
      //    apiData = companyPreferencesService.getMenu(1);
      //  });
      //
      //  it('should fetch and return menuList', function () {
      //    $httpBackend.expectGET(/menus/);
      //  });
      //});
      //
      //describe('updateMenu', function () {
      //  beforeEach(function () {
      //    $httpBackend.whenPUT(/menus/).respond({done: true});
      //  });
      //  it('it should POST data to menus API', function () {
      //    companyPreferencesService.updateMenu({menuData: 'fakeMenuPayload'});
      //    $httpBackend.flush();
      //    $httpBackend.expectPUT(/menus/);
      //  });
      //});

    });
  });

});
