'use strict';

describe('Factory: currencyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencyFactory,
    currenciesService,
    dailyExchangeRatesService,
    companiesService,
    rootScope,
    scope;
  beforeEach(inject(function ($rootScope, _currencyFactory_, _currenciesService_, _dailyExchangeRatesService_, _companiesService_) {

    companiesService = _companiesService_;
    currenciesService = _currenciesService_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;

    spyOn(companiesService, 'getCompany');
    spyOn(currenciesService, 'getCompanyGlobalCurrencies');
    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(dailyExchangeRatesService, 'getPreviousExchangeRates');
    spyOn(dailyExchangeRatesService, 'getDailyExchangeRates');
    spyOn(dailyExchangeRatesService, 'saveDailyExchangeRates');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    currencyFactory = _currencyFactory_;
  }));

  it('should be defined', function () {
    expect(!!currencyFactory).toBe(true);
  });

});


// TODO: complete tests
