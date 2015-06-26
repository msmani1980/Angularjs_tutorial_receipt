'use strict';

describe('Factor: ItemImportFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var ItemImportFactory,
    GlobalMenuService,
    companiesService,
    itemsService,
    scope;

  beforeEach(inject(function ($rootScope, _ItemImportFactory_, _GlobalMenuService_, _companiesService_, _itemsService_) {
    GlobalMenuService = _GlobalMenuService_;
    companiesService = _companiesService_;
    itemsService = _itemsService_;

    spyOn(GlobalMenuService.company, 'get');
    spyOn(companiesService, 'getCompaniesList');
    spyOn(itemsService, 'getItemsList');
    spyOn(itemsService, 'createItem');

    ItemImportFactory = _ItemImportFactory_;
    scope = $rootScope.$new();
  }));

  it('should be defined', function () {
    expect(!!ItemImportFactory).toBe(true);
  });

  describe('GlobalMenuService API', function () {
    it('should call globalMenuService on company.get', function () {
      ItemImportFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });

  describe('companiesService API', function() {
    it('should call getCompaniesList', function() {
      var payload = {companyTypeId:413};
      ItemImportFactory.getCompaniesList(payload);
      expect(companiesService.getCompaniesList).toHaveBeenCalledWith(payload);
    });
  });

  describe('itemsService API', function(){
    it('should call getItemsList', function(){
      var params = {companyId:413};
      ItemImportFactory.getItemsList(params);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(params, undefined);
    });
    it('should call createItem', function(){
      var payload = {retailItem:{}};
      ItemImportFactory.createItem(payload);
      expect(itemsService.createItem).toHaveBeenCalledWith(payload);
    });
  });
});
