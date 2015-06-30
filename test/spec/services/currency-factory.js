// TODO: complete tests
'use strict';

describe('Factory: currencyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencyFactory,
    currenciesService,
    dailyExchangeRatesService,
    companyService,
    companyPreferencesService,
    rootScope,
    scope;
  beforeEach(inject(function ($rootScope, _currencyFactory_, _currenciesService_, _dailyExchangeRatesService_, _companyService_, _companyPreferencesService_) {

    companyService = _companyService_;
    currenciesService = _currenciesService_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;
    companyPreferencesService = _companyPreferencesService_;

    spyOn(companyService, 'getCompany');
    spyOn(currenciesService, 'getCompanyGlobalCurrencies');
    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(dailyExchangeRatesService, 'getPreviousExchangeRates');
    spyOn(dailyExchangeRatesService, 'getDailyExchangeRates');
    spyOn(dailyExchangeRatesService, 'saveDailyExchangeRates');
    spyOn(companyPreferencesService, 'getCompanyPreferences');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    currencyFactory = _currencyFactory_;
  }));

  it('should be defined', function () {
    expect(!!currencyFactory).toBe(true);
  });

  describe('companyService API', function () {
    it('should call companyService on getCompany', function () {
      currencyFactory.getCompany(2);
      expect(companyService.getCompany).toHaveBeenCalled();
    });
  });

  describe('currenciesService API', function () {
    it('should call currenciesService on getCompanyGlobalCurrencies', function () {
      currencyFactory.getCompanyGlobalCurrencies();
      expect(currenciesService.getCompanyGlobalCurrencies).toHaveBeenCalled();
    });

    it('should call currenciesService on getCompanyCurrencies', function () {
      currencyFactory.getCompanyCurrencies();
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalled();
    });
  });


  describe('currenciesService API', function () {
    it('should call dailyExchangeRatesService on getPreviousExchangeRates', function () {
      currencyFactory.getPreviousExchangeRates();
      expect(dailyExchangeRatesService.getPreviousExchangeRates).toHaveBeenCalled();
    });

    it('should call dailyExchangeRatesService on getDailyExchangeRates', function () {
      currencyFactory.getDailyExchangeRates();
      expect(dailyExchangeRatesService.getDailyExchangeRates).toHaveBeenCalled();
    });

    it('should call dailyExchangeRatesService on saveDailyExchangeRates', function () {
      currencyFactory.saveDailyExchangeRates();
      expect(dailyExchangeRatesService.saveDailyExchangeRates).toHaveBeenCalled();
    });
  });

  describe('companyPreferences API', function () {
    it('should call companyPreferences on getList', function () {
      currencyFactory.getCompanyPreferences();
      expect(companyPreferencesService.getCompanyPreferences).toHaveBeenCalled();
    });
  });
});

