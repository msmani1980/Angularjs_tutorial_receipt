'use strict';

describe('Controller: EmployeeCommissionListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json', 'served/price-types.json', 'served/tax-rate-types.json'));


  var EmployeeCommissionListCtrl,
    employeeCommissionFactory,
    getItemsListDeferred,
    getPriceTypesListDeferred,
    getTaxRateTypesDeferred,
    itemsListJSON,
    priceTypeListJSON,
    taxRateTypesJSON,
    scope;

  beforeEach(inject(function ($controller, $rootScope, $q, $injector) {
    inject(function (_servedItemsList_, _servedPriceTypes_, _servedTaxRateTypes_) {
      itemsListJSON = _servedItemsList_;
      priceTypeListJSON = _servedPriceTypes_;
      taxRateTypesJSON = _servedTaxRateTypes_;
    });

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(itemsListJSON);

    getPriceTypesListDeferred = $q.defer();
    getPriceTypesListDeferred.resolve(priceTypeListJSON);

    getTaxRateTypesDeferred = $q.defer();
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);

    employeeCommissionFactory = $injector.get('employeeCommissionFactory');
    spyOn(employeeCommissionFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getPriceTypesList').and.returnValue(getPriceTypesListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getTaxRateTypes').and.returnValue(getTaxRateTypesDeferred.promise);

    scope = $rootScope.$new();
    EmployeeCommissionListCtrl = $controller('EmployeeCommissionListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBeDefined();
  });

  describe('search object', function(){

    it('should exists in scope', function () {
      expect(scope.search).toBeDefined();
    });

    it('should have required properties', function () {
      expect(Object.keys(scope.search)).toEqual(['startDate', 'itemList', 'priceTypesList', 'taxRateTypesList']);
    });

  });

  describe('API requests', function(){

    it('should call get price type from factory', function(){
      expect(employeeCommissionFactory.getPriceTypesList).toHaveBeenCalled();
    });

    it('should call get tax rate type from factory', function(){
      expect(employeeCommissionFactory.getTaxRateTypes).toHaveBeenCalled();
    });

  });

});
