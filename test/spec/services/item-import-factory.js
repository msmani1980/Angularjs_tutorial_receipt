'use strict';

describe('Factor: itemImportFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var itemImportFactory,
    globalMenuService,
    companyService,
    itemsService,
    itemImportService,
    scope;

  beforeEach(inject(function ($rootScope, _itemImportFactory_, _globalMenuService_, _companyService_, _itemsService_, _itemImportService_) {
    globalMenuService = _globalMenuService_;
    companyService = _companyService_;
    itemsService = _itemsService_;
    itemImportService = _itemImportService_;

    spyOn(globalMenuService.company, 'get').and.returnValue(403);
    spyOn(companyService, 'getCompanyList');
    spyOn(itemsService, 'getItemsList');
    spyOn(itemImportService, 'importItems');

    itemImportFactory = _itemImportFactory_;
    scope = $rootScope.$new();
  }));

  it('should be defined', function () {
    expect(!!itemImportFactory).toBe(true);
  });

  describe('globalMenuService API', function () {
    it('should call globalMenuService on company.get', function () {
      itemImportFactory.getCompanyId();
      expect(globalMenuService.company.get).toHaveBeenCalled();
    });
  });

  describe('companyService API', function() {
    it('should call getCompanyList', function() {
      var payload = { companyTypeId:413 };
      itemImportFactory.getCompanyList(payload);
      expect(companyService.getCompanyList).toHaveBeenCalledWith(payload);
    });
  });

  describe('itemsService API', function() {
    it('should call getItemsList', function() {
      var params = { companyId:413 };
      itemImportFactory.getItemsList(params);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(params, undefined);
    });
  });

  describe('itemImportService API', function() {
    it('should call importItems', function() {
      var payload = [2, 3, 4];
      itemImportFactory.importItems(payload);
      expect(itemImportService.importItems).toHaveBeenCalledWith(payload);
    });
  });

});
