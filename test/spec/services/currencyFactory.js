'use strict';

describe('Factory: currencyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencyFactory,
    currencies,
    deferred,
    rootScope,
    scope;
  beforeEach(inject(function ($rootScope, $q, _currencyFactory_, _currencies_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    deferred = $q.defer();
    currencies = _currencies_;

    spyOn(currencies, 'getCompanyBaseCurrency').and.returnValue(deferred.promise);
    spyOn(currencies, 'getCompanyCurrencies').and.returnValue(deferred.promise);
    currencyFactory = _currencyFactory_;
  }));

  it('should be defined', function () {
    expect(!!currencyFactory).toBe(true);
  });

  it('should call getCompanyBaseCurrency from currencies service', function () {
    currencyFactory.getCompanyBaseCurrency();
    expect(currencies.getCompanyBaseCurrency).toHaveBeenCalled();
  });

  it('should return companyCurrency object', function () {
    currencyFactory.getCompanyBaseCurrency().then(function (companyCurrency) {
      expect(companyCurrency.currencyCode).toBe('fakeCurrencyCode');
    });
    deferred.resolve({currencyCode: 'fakeCurrencyCode'});
    scope.$digest();
  });

  it('should call getCompanyCurrencies from currencies service', function () {
    currencyFactory.getCompanyCurrencies();
    expect(currencies.getCompanyCurrencies).toHaveBeenCalledWith();
  });

  it('should return the company currencies array from currencies service', function () {
    currencyFactory.getCompanyCurrencies().then(function (companyCurrencyArray) {
      expect(companyCurrencyArray[0].currencyCode).toBe('fakeCurrencyCode');
    });
    deferred.resolve([{currencyCode: 'fakeCurrencyCode'}]);
    scope.$digest();
  });

});
