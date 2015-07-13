'use strict';

describe('Controller: EmployeeCommissionEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/master-item-list.json', 'served/price-types.json', 'served/tax-rate-types.json', 'served/company-currency-globals.json'));


  var EmployeeCommissionEditCtrl,
    employeeCommissionFactory,
    getItemsListDeferred,
    getPriceTypesListDeferred,
    getTaxRateTypesDeferred,
    getCompanyCurrenciesDeferred,
    masterItemsListJSON,
    priceTypeListJSON,
    taxRateTypesJSON,
    companyCurrencyJSON,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector) {
    inject(function (_servedMasterItemList_, _servedPriceTypes_, _servedTaxRateTypes_, _servedCompanyCurrencyGlobals_) {
      masterItemsListJSON = _servedMasterItemList_;
      priceTypeListJSON = _servedPriceTypes_;
      taxRateTypesJSON = _servedTaxRateTypes_;
      companyCurrencyJSON = _servedCompanyCurrencyGlobals_;
    });

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(masterItemsListJSON);

    getPriceTypesListDeferred = $q.defer();
    getPriceTypesListDeferred.resolve(priceTypeListJSON);

    getTaxRateTypesDeferred = $q.defer();
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);

    getCompanyCurrenciesDeferred = $q.defer();
    getCompanyCurrenciesDeferred.resolve(companyCurrencyJSON);

    employeeCommissionFactory = $injector.get('employeeCommissionFactory');
    spyOn(employeeCommissionFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getPriceTypesList').and.returnValue(getPriceTypesListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getTaxRateTypes').and.returnValue(getTaxRateTypesDeferred.promise);
    spyOn(employeeCommissionFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);
    spyOn(employeeCommissionFactory, 'createCommission').and.returnValue(getCompanyCurrenciesDeferred.promise);

    scope = $rootScope.$new();
    EmployeeCommissionEditCtrl = $controller('EmployeeCommissionEditCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('initialize', function(){

    it('should have a list of items attached to scope', function(){
      expect(scope.itemsList).toBeDefined();
    });

    it('should have a list of price types attached to scope', function(){
      expect(scope.priceTypesList).toBeDefined();
    });

    it('should have a list of price types attached to scope', function(){
      expect(scope.taxRateTypes).toBeDefined();
    });

    it('should have a list of currencies attached to scope', function(){
      expect(scope.companyCurrencies).toBeDefined();
    });
  });

});
