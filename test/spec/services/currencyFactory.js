'use strict';

describe('Factory: currencyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencyFactory,
    currencies,
    dailyExchangeRatesService,
    deferred,
    previousExchangeDeferred,
    dailyExchangeDeferred,
    rootScope,
    scope;
  beforeEach(inject(function ($rootScope, $q, _currencyFactory_, _currencies_, _dailyExchangeRatesService_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    deferred = $q.defer();
    previousExchangeDeferred = $q.defer();
    dailyExchangeDeferred = $q.defer();
    currencies = _currencies_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;

    spyOn(currencies, 'getCompanyBaseCurrency').and.returnValue(deferred.promise);
    spyOn(currencies, 'getCompanyCurrencies').and.returnValue(deferred.promise);
    spyOn(dailyExchangeRatesService, 'getDailyExchangeRates').and.returnValue(dailyExchangeDeferred.promise);
    spyOn(dailyExchangeRatesService, 'getPreviousExchangeRates').and.returnValue(previousExchangeDeferred.promise);
    spyOn(dailyExchangeRatesService, 'saveDailyExchangeRates').and.returnValue(deferred.promise);
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
    currencyFactory.getDailyExchangeRates('04202015');
    expect(dailyExchangeRatesService.getDailyExchangeRates).toHaveBeenCalled();
  });

  it('should return the company daily exchange rate array from dailyExchangeRatesService', function () {
    currencyFactory.getDailyExchangeRates('04202015').then(function (dailyExchangeRatesArray) {
      expect(dailyExchangeRatesArray[0].currencyCode).toBe('fakeCurrencyCode');
    });
    dailyExchangeDeferred.resolve([{currencyCode: 'fakeCurrencyCode'}]);
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
    previousExchangeDeferred.resolve([{currencyCode: 'fakeCurrencyCode'}]);
    scope.$digest();
  });

  describe('daily exchange rates for today', function () {

    it('should return previous exchange rate if daily exchange rate is null or empty', function () {

      currencyFactory.getDailyExchangeRates('04202015').then(function (dailyExchangeRatesArray) {
        expect(dailyExchangeRatesArray[0].previousCurrencyCode).toBe('fakeCurrencyCode');
      });
      dailyExchangeDeferred.resolve(null);
      previousExchangeDeferred.resolve([{previousCurrencyCode: 'fakeCurrencyCode'}]);
      scope.$digest();
    });
  });

  describe('Save daily Exchange Rates', function () {
    it('should call saveDailyExchangeRates from dailyExchangeRatesService', function () {
      var fakePayload = {};
      currencyFactory.saveDailyExchangeRates(fakePayload);
      expect(dailyExchangeRatesService.saveDailyExchangeRates).toHaveBeenCalledWith(fakePayload);
    });
  });

});
