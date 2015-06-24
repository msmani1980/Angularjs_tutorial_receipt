'use strict';

describe('Controller: ItemImportCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stockowner-companies.json', 'served/items-list.json'));

  var ItemImportCtrl,
    scope,
    ItemImportFactory,
    stockownerCompaniesResponseJSON,
    getCompaniesListDeferred,
    companyId,
    stockOwnerItemsResponseJSON,
    getItemsListDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _ItemImportFactory_) {
    scope = $rootScope.$new();

    inject(function (_servedStockownerCompanies_, _servedItemsList_) {
      stockownerCompaniesResponseJSON = _servedStockownerCompanies_;
      stockOwnerItemsResponseJSON = _servedItemsList_;
    });

    ItemImportFactory = _ItemImportFactory_;

    getCompaniesListDeferred = $q.defer();
    getCompaniesListDeferred.resolve(stockownerCompaniesResponseJSON);
    spyOn(ItemImportFactory, 'getCompaniesList').and.returnValue(getCompaniesListDeferred.promise);

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(stockOwnerItemsResponseJSON);
    spyOn(ItemImportFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);

    companyId = ItemImportFactory.getCompanyId();

    ItemImportCtrl = $controller('ItemImportCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('scope globals', function(){
    it('should attach a viewName to the scope', function () {
      expect(scope.viewName).toBe('Import Stock Owner Items');
    });
    it('should have a importAll function attached to the scope', function () {
      expect(scope.importAll).toBeDefined();
      expect(Object.prototype.toString.call(scope.importAll)).toBe('[object Function]');
    });
  });

  describe('ItemImportFactory API calls', function(){
    it('should call getCompaniesList', function () {
      expect(ItemImportFactory.getCompaniesList).toHaveBeenCalledWith({companyTypeId:2,limit:null});
    });
    it('should have stockOwnerList attached to scope after API call', function () {
      expect(scope.stockOwnerList).toBeDefined();
      expect(Object.prototype.toString.call(scope.stockOwnerList)).toBe('[object Array]');
    });
    it('should call getItemsList', function(){
      expect(ItemImportFactory.getItemsList).toHaveBeenCalled();
    });
    it('should have itemList attached to scope after API call', function(){
      expect(scope.itemList).toBeDefined();
      expect(Object.prototype.toString.call(scope.itemList)).toBe('[object Array]');
    });
  });


  describe('importAll form action', function(){
    it('should call getItemsList from factory with a companyId', function(){
      scope.importAll(362);
      scope.$digest();
      expect(ItemImportFactory.getItemsList).toHaveBeenCalledWith({companyId:362});
    });
    /* TODO this test fails, why? */
    it('should have stockOwnerItemsList attached to scope after API call', function(){
      expect(scope.stockOwnerItemsList).toBeDefined();
      expect(Object.prototype.toString.call(scope.stockOwnerItemsList)).toBe('[object Array]');
    });
    /**/
  });


});
