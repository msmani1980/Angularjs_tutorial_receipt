'use strict';
/*global $:false */

describe('Controller: CompanyExchangeRateEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/company.json',
    'served/currencies.json',
    'served/currency.json',
    'served/company-currency-globals.json',
    'served/company-exchange-rates.json',
    'served/company-exchange-rate.json'
  ));

  var CompanyExchangeRateEditCtrl,
    scope,
    dateUtility,
    currencyFactory,
    getCompanyGlobalCurrenciesDeferred,
    getDetailedCompanyCurrenciesDeferred,
    getCompanyExchangeRatesDeferred,
    getCompanyDeferred,
    companyJSON,
    currenciesJSON,
    currencyJSON,
    masterCurrenciesJSON,
    companyExchangeRatesJSON,
    companyExchangeRateJSON,
    payloadUtility;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $httpBackend, $controller, $rootScope, _dateUtility_, _currencyFactory_, _servedCompany_, _servedCurrencies_, _servedCurrency_, _servedCompanyCurrencyGlobals_, _servedCompanyExchangeRates_, _servedCompanyExchangeRate_, _payloadUtility_) {
    scope = $rootScope.$new();

    dateUtility = _dateUtility_;
    currencyFactory = _currencyFactory_;
    companyJSON = _servedCompany_;
    currenciesJSON = _servedCurrencies_;
    currencyJSON = _servedCurrency_;
    masterCurrenciesJSON = _servedCompanyCurrencyGlobals_;
    companyExchangeRatesJSON = _servedCompanyExchangeRates_;
    companyExchangeRateJSON = _servedCompanyExchangeRate_;
    payloadUtility = _payloadUtility_;

    getCompanyGlobalCurrenciesDeferred = $q.defer();
    getCompanyGlobalCurrenciesDeferred.resolve(masterCurrenciesJSON);
    getDetailedCompanyCurrenciesDeferred = $q.defer();
    getDetailedCompanyCurrenciesDeferred.resolve(currenciesJSON);
    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyJSON);
    getCompanyExchangeRatesDeferred = $q.defer();
    getCompanyExchangeRatesDeferred.resolve(companyExchangeRatesJSON);

    spyOn(currencyFactory, 'getCompanyGlobalCurrencies').and.returnValue(getCompanyGlobalCurrenciesDeferred.promise);
    spyOn(currencyFactory, 'getDetailedCompanyCurrencies').and.returnValue(getDetailedCompanyCurrenciesDeferred.promise);
    spyOn(currencyFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);
    spyOn(currencyFactory, 'getCompanyExchangeRates').and.returnValue();
    spyOn(currencyFactory, 'deleteCompanyExchangeRate').and.returnValue();
    spyOn(currencyFactory, 'createCompanyExchangeRate').and.callFake(function () { return $.Deferred().resolve(companyExchangeRateJSON);});
    spyOn(currencyFactory, 'updateCompanyExchangeRate').and.callFake(function () { return $.Deferred().resolve(companyExchangeRateJSON);});

    $httpBackend.whenGET(/companies/).respond(companyJSON);

    CompanyExchangeRateEditCtrl = $controller('CompanyExchangeRateEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Manage Retail Company Exchange Rate');
  });

  it('should get the company global currencies called', function () {
    expect(currencyFactory.getCompanyGlobalCurrencies).toHaveBeenCalled();
  });

  it('should get company global currencies', function () {
    CompanyExchangeRateEditCtrl.getCompanyGlobalCurrencies();
    expect(currencyFactory.getCompanyGlobalCurrencies().then(function (globalCurrencies) {
      expect(globalCurrencies.response.length).toBeGreaterThan(0);
    }));
  });

  it('should filter currency exchange rates', function () {
    scope.search = {};
    expect(scope.companyExchangeRateFilter(companyExchangeRateJSON)).toBe(true);

    scope.search = {acceptedCurrencies: []};
    expect(scope.companyExchangeRateFilter(companyExchangeRateJSON)).toBe(true);

    scope.search = {acceptedCurrencies: [{currencyCode: 'GBP'}]};
    expect(scope.companyExchangeRateFilter(companyExchangeRateJSON)).toBe(true);

    scope.search = {acceptedCurrencies: [{currencyCode: 'GBP'}, {currencyCode: 'EUR'}]};
    expect(scope.companyExchangeRateFilter(companyExchangeRateJSON)).toBe(true);

    scope.search = {acceptedCurrencies: [{currencyCode: 'USD'}]};
    expect(scope.companyExchangeRateFilter(companyExchangeRateJSON)).toBe(false);
  });

  it('should create denomination map', function () {
    scope.globalCurrencies = currenciesJSON.response;
    CompanyExchangeRateEditCtrl.getDenominations();

    expect(3 in scope.currencyDenominations).toBe(true);
  });

  it('should find denomination by id', function () {
    scope.globalCurrencies = currenciesJSON.response;
    CompanyExchangeRateEditCtrl.getDenominations();

    expect(CompanyExchangeRateEditCtrl.getDenominationById(3)).toEqual({
      currencyId: 0,
      denomination: '12.000',
      id: 3,
      isDeleted: null
    });
  });

  it('should get company base currency', function () {
    scope.globalCurrencyList = currenciesJSON;
    CompanyExchangeRateEditCtrl.getCompanyBaseCurrency();

    expect(scope.companyBaseCurrency.code).toBe('EUR');
  });

  it('should delete company exchange rate be called', function () {
    CompanyExchangeRateEditCtrl.deleteCompanyExchangeRate(1);

    expect(currencyFactory.deleteCompanyExchangeRate).toHaveBeenCalled();
  });

  it('should get detailed company currencies for search inputs', function () {
    CompanyExchangeRateEditCtrl.getDetailedCompanyCurrenciesForSearch(1);

    expect(currencyFactory.getDetailedCompanyCurrencies).toHaveBeenCalled();
  });

  it('should create payload with denormalizeCompanyExchangeRate', function () {
    scope.search.operatingCurrencyCode = 'GBP';
    companyExchangeRateJSON.startDate = '10/01/2015';
    companyExchangeRateJSON.endDate = '10/01/2016';

    var payload = CompanyExchangeRateEditCtrl.denormalizeCompanyExchangeRate(1, companyExchangeRateJSON);
    expect(payload).toEqual({
        id: 72,
        acceptedCurrencyCode: 'GBP',
        operatingCurrencyCode: 'GBP',
        companyId: undefined,
        exchangeRate: '2.0000',
        exchangeRateType: 1,
        startDate: '20151001',
        endDate: '20161001'
      }
    );
  });

  it('isSearchFormValid should return true on valid search form', function () {
    expect(scope.isSearchFormValid()).toBe(false);

    scope.search = {};
    expect(scope.isSearchFormValid()).toBe(false);

    scope.search = {operatingCurrencyCode: 'GBP'};
    expect(scope.isSearchFormValid()).toBe(true);
  });

  it('should clear search model and make get detailed company currencies', function () {
    scope.search = {
      startDate: 'fakeDate'
    };
    scope.clearSearchForm();
    expect(scope.search).toEqual({});
    expect(scope.companyExchangeRates).toEqual([]);
    expect(scope.search.startDate).toBe(undefined);

  });

});
