'use strict';

describe('Factory: currencyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencyFactory,
    currencies,
    dailyExchangeRatesService,
    deferred,
    rootScope,
    scope;
  beforeEach(inject(function ($rootScope, $q, _currencyFactory_, _currencies_, _dailyExchangeRatesService_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    deferred = $q.defer();
    currencies = _currencies_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;

    spyOn(currencies, 'getCompanyBaseCurrency').and.returnValue(deferred.promise);
    spyOn(currencies, 'getCompanyCurrencies').and.returnValue(deferred.promise);
    spyOn(dailyExchangeRatesService, 'getDailyExchangeRates').and.returnValue(deferred.promise);
    spyOn(dailyExchangeRatesService, 'getPreviousExchangeRates').and.returnValue(deferred.promise);
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
    expect(currencies.getCompanyCurrencies).toHaveBeenCalled();
  });

  it('should return the company currencies array from currencies service', function () {
    currencyFactory.getCompanyCurrencies().then(function (companyCurrencyArray) {
      expect(companyCurrencyArray[0].currencyCode).toBe('fakeCurrencyCode');
    });
    deferred.resolve([{currencyCode: 'fakeCurrencyCode'}]);
    scope.$digest();
  });

  it('should call getDailyExchangeRates from dailyExchangeRatesService service', function () {
    currencyFactory.getDailyExchangeRates();
    expect(dailyExchangeRatesService.getDailyExchangeRates).toHaveBeenCalled();
  });

  it('should return the company daily exchange rate array from dailyExchangeRatesService', function () {
    currencyFactory.getDailyExchangeRates().then(function (dailyExchangeRatesArray) {
      expect(dailyExchangeRatesArray[0].currencyCode).toBe('fakeCurrencyCode');
    });
    deferred.resolve([{currencyCode: 'fakeCurrencyCode'}]);
    scope.$digest();
  });

  it('should call getpreviousExchangeRates from dailyExchangeRatesService service', function () {
    currencyFactory.getPreviousExchangeRates();
    expect(dailyExchangeRatesService.getPreviousExchangeRates).toHaveBeenCalled();
  });

  it('should return the company daily exchange rate array from getpreviousExchangeRates', function () {
    currencyFactory.getPreviousExchangeRates().then(function (previousExchangeRatesArray) {
      expect(previousExchangeRatesArray[0].currencyCode).toBe('fakeCurrencyCode');
    });
    deferred.resolve([{currencyCode: 'fakeCurrencyCode'}]);
    scope.$digest();
  });

});
