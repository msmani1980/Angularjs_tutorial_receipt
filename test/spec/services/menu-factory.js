'use strict';

describe('Service: menuFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuFactory,
    menuService,
    itemsService,
    globalMenuService,
    salesCategoriesService;

  beforeEach(inject(function (_menuFactory_, $injector) {

    menuService = $injector.get('menuService');
    itemsService = $injector.get('itemsService');
    globalMenuService = $injector.get('globalMenuService');
    salesCategoriesService = $injector.get('salesCategoriesService');

    spyOn(menuService, 'getMenu').and.stub();
    spyOn(menuService, 'updateMenu').and.stub();
    spyOn(menuService, 'createMenu').and.stub();
    spyOn(itemsService, 'getItemsList').and.stub();
    spyOn(globalMenuService.company, 'get').and.returnValue(403);
    spyOn(salesCategoriesService, 'getSalesCategoriesList').and.stub();

    menuFactory = _menuFactory_;
  }));

  it('should exists', function () {
    expect(!!menuFactory).toBe(true);
  });

  describe('API Calls', function() {

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

    it('should call itemsService.getItemsList with a payload and a flag to get items from master list', function () {
      var payload = {
        fake: 'data'
      };
      menuFactory.getItemsList(payload, true);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(payload, true);
    });

    it('should call itemsService and reformat date payloads', function () {
      var payload = {
        startDate: '07/11/2015',
        endDate: '08/12/2015'
      };
      var reformattedPayload = {
        startDate: '20150711',
        endDate: '20150812'
      };
      menuFactory.getItemsList(payload, true);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(reformattedPayload, true);
    });

    it('should call globalMenuService.company.get with a payload and a flag to get items from master list', function () {
      menuFactory.getCompanyId();
      expect(globalMenuService.company.get).toHaveBeenCalled();
    });

    it('should call salesCategoriesService.getSalesCategoriesList with a payload to get a categories list', function () {
      var payload = {
        fake: 'data'
      };
      menuFactory.getSalesCategoriesList(payload);
      expect(salesCategoriesService.getSalesCategoriesList).toHaveBeenCalledWith(payload);
    });

  });

});
