'use strict';

describe('Service: menuFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuFactory,
    menuService,
    itemsService,
    GlobalMenuService;

  beforeEach(inject(function (_menuFactory_, $injector) {

    menuService = $injector.get('menuService');
    itemsService = $injector.get('itemsService');
    GlobalMenuService = $injector.get('GlobalMenuService');

    spyOn(menuService, 'getMenu').and.stub();
    spyOn(menuService, 'updateMenu').and.stub();
    spyOn(menuService, 'createMenu').and.stub();
    spyOn(itemsService, 'getItemsList').and.stub();
    spyOn(GlobalMenuService.company, 'get').and.stub();

    menuFactory = _menuFactory_;
  }));

  it('should exists', function () {
    expect(!!menuFactory).toBe(true);
  });

  describe('API Calls', function(){

    it('should call menuService.getMenu with a menuId', function () {
      menuFactory.getMenu(2);
      expect(menuService.getMenu).toHaveBeenCalledWith(2);
    });

    it('should call menuService.updateMenu with a payload', function () {
      var payload = {
        fake: 'data'
      };
      menuFactory.updateMenu(payload);
      expect(menuService.updateMenu).toHaveBeenCalledWith(payload);
    });

    it('should call menuService.createMenu with a payload', function () {
      var payload = {
        fake: 'data'
      };
      menuFactory.createMenu(payload);
      expect(menuService.createMenu).toHaveBeenCalledWith(payload);
    });

    it('should call GlobalMenuService.company.get', function () {
      menuFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });

    it('should call itemsService.getItemsList with a payload and a flag to get items from master list', function () {
      var payload = {
        fake: 'data'
      };
      menuFactory.getItemsList(payload, true);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(payload, true);
    });

  });

});
