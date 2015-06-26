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

  describe('scope globals', function () {
    it('should attach a viewName to the scope', function () {
      expect(scope.viewName).toBe('Import Stock Owner Items');
    });
    it('should have a changeSelectedStockownerCompany function attached to the scope', function(){
      expect(scope.changeSelectedStockownerCompany).toBeDefined();
      expect(Object.prototype.toString.call(scope.changeSelectedStockownerCompany)).toBe('[object Function]');
    });
    it('should have a importAll function attached to the scope', function(){
      expect(scope.importAll).toBeDefined();
      expect(Object.prototype.toString.call(scope.importAll)).toBe('[object Function]');
    });
    it('should have a isAirlineItem function attached to the scope', function(){
      expect(scope.isAirlineItem).toBeDefined();
      expect(Object.prototype.toString.call(scope.isAirlineItem)).toBe('[object Function]');
    });
    it('should have a removeRetailItem function attached to the scope', function(){
      expect(scope.removeRetailItem).toBeDefined();
      expect(Object.prototype.toString.call(scope.removeRetailItem)).toBe('[object Function]');
    });
    it('should have a removeAll function attached to the scope', function(){
      expect(scope.removeAll).toBeDefined();
      expect(Object.prototype.toString.call(scope.removeAll)).toBe('[object Function]');
    });
    it('should have a dropSuccessHandler function attached to the scope', function(){
      expect(scope.dropSuccessHandler).toBeDefined();
      expect(Object.prototype.toString.call(scope.dropSuccessHandler)).toBe('[object Function]');
    });
    it('should have a onDrop function attached to the scope', function(){
      expect(scope.onDrop).toBeDefined();
      expect(Object.prototype.toString.call(scope.onDrop)).toBe('[object Function]');
    });
  });

  describe('ItemImportFactory API calls', function () {

    it('should call getCompaniesList', function () {
      expect(ItemImportFactory.getCompaniesList).toHaveBeenCalledWith({
        companyTypeId: 2,
        limit: null
      });
    });
    it('should have stockOwnerList attached to scope after API call', function () {
      expect(scope.stockOwnerList).toBeDefined();
      expect(angular.isArray(scope.stockOwnerList)).toBe(true);
    });
    it('should call getItemsList', function () {
      expect(ItemImportFactory.getItemsList).toHaveBeenCalled();
    });
    it('should have airlineRetailItemList attached to scope after API call', function () {
      expect(scope.airlineRetailItemList).toBeDefined();
    });
  });

/*
  describe('importAll form action', function () {

    beforeEach(function(){
      scope.importAll(362);
      scope.$digest();
    });

    it('should call getItemsList from factory with a companyId', function () {
      expect(ItemImportFactory.getItemsList).toHaveBeenCalledWith({companyId: 362});
    });

    it('should have stockOwnerItemsList attached to scope after API call', function () {
      expect(scope.stockOwnerItemsList).toBeDefined();
      expect(angular.isArray(scope.stockOwnerItemsList)).toBe(true);
    });
  });
*/

});
