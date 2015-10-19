'use strict';
/*global moment*/

fdescribe('Controller: CurrencyEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/company.json',
    'served/currencies.json',
    'served/currency.json',
    'served/company-currency-globals.json'
  ));

  var CurrencyEditCtrl,
    scope,
    currencyFactory,
    companyJSON,
    currenciesJSON,
    currencyJSON,
    masterCurrenciesJSON,
    getCompanyGlobalCurrenciesDeferred,
    getDetailedCompanyCurrenciesDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $httpBackend, $controller, $rootScope, _currencyFactory_, _servedCompany_, _servedCurrencies_, _servedCurrency_, _servedCompanyCurrencyGlobals_) {
    scope = $rootScope.$new();

    currencyFactory = _currencyFactory_;
    companyJSON = _servedCompany_;
    currenciesJSON = _servedCurrencies_;
    currencyJSON = _servedCurrency_;
    masterCurrenciesJSON = _servedCompanyCurrencyGlobals_;

    getCompanyGlobalCurrenciesDeferred = $q.defer();
    getCompanyGlobalCurrenciesDeferred.resolve(masterCurrenciesJSON);
    getDetailedCompanyCurrenciesDeferred = $q.defer();
    getDetailedCompanyCurrenciesDeferred.resolve(currenciesJSON);

    spyOn(currencyFactory, 'getCompanyGlobalCurrencies').and.returnValue(getCompanyGlobalCurrenciesDeferred.promise);
    spyOn(currencyFactory, 'getDetailedCompanyCurrencies').and.returnValue(getDetailedCompanyCurrenciesDeferred.promise);

    $httpBackend.whenGET(/companies/).respond(companyJSON);

    CurrencyEditCtrl = $controller('CurrencyEditCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Retail Company Currency & Denomination Setup');
  });
});
