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
    currencyFactory = _currencyFactory_;
  }));

  it('should be defined', function () {
    expect(!!currencyFactory).toBe(true);
  });

  it('should call currencies getCompanyBaseCurrency', function () {
    currencyFactory.getCompanyBaseCurrency();
    expect(currencies.getCompanyBaseCurrency).toHaveBeenCalled();
  });

  it('should return companyCurrency from currencyFactory', function () {
    currencyFactory.getCompanyBaseCurrency().then(function (companyCurrency) {
      expect(companyCurrency.currencyCode).toBe('fakeCurrencyCode');
    });
    deferred.resolve({currencyCode: 'fakeCurrencyCode'});
    scope.$digest();
  });

});
