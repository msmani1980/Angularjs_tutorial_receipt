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
    companyExchangeRateService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _currencyFactory_, _currenciesService_, _dailyExchangeRatesService_, _companyService_, _companyPreferencesService_, _companyExchangeRateService_) {

    companyService = _companyService_;
    currenciesService = _currenciesService_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;
    companyPreferencesService = _companyPreferencesService_;
    companyExchangeRateService = _companyExchangeRateService_;

    spyOn(companyService, 'getCompany');
    spyOn(currenciesService, 'getCompanyGlobalCurrencies');
    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(currenciesService, 'getDetailedCompanyCurrencies');
    spyOn(currenciesService, 'deleteDetailedCompanyCurrency');
    spyOn(currenciesService, 'createDetailedCompanyCurrency');
    spyOn(currenciesService, 'updateDetailedCompanyCurrency');
    spyOn(dailyExchangeRatesService, 'getPreviousExchangeRates');
    spyOn(dailyExchangeRatesService, 'getDailyExchangeRates');
    spyOn(dailyExchangeRatesService, 'saveDailyExchangeRates');
    spyOn(companyPreferencesService, 'getCompanyPreferences');
    spyOn(companyExchangeRateService, 'getCompanyExchangeRates');
    spyOn(companyExchangeRateService, 'deleteCompanyExchangeRate');
    spyOn(companyExchangeRateService, 'createCompanyExchangeRate');
    spyOn(companyExchangeRateService, 'updateCompanyExchangeRate');

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

    it('should call currenciesService on getDetailedCompanyCurrencies', function () {
      currencyFactory.getDetailedCompanyCurrencies();
      expect(currenciesService.getDetailedCompanyCurrencies).toHaveBeenCalled();
    });

    it('should call currenciesService on deleteDetailedCompanyCurrency', function () {
      currencyFactory.deleteDetailedCompanyCurrency();
      expect(currenciesService.deleteDetailedCompanyCurrency).toHaveBeenCalled();
    });

    it('should call currenciesService on createDetailedCompanyCurrency', function () {
      currencyFactory.createDetailedCompanyCurrency();
      expect(currenciesService.createDetailedCompanyCurrency).toHaveBeenCalled();
    });

    it('should call currenciesService on updateDetailedCompanyCurrency', function () {
      currencyFactory.updateDetailedCompanyCurrency();
      expect(currenciesService.updateDetailedCompanyCurrency).toHaveBeenCalled();
    });
  });


  describe('dailyExchangeRatesService API', function () {
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

  describe('companyExchangeRateService API', function () {
    it('should call companyExchangeRateService on getCompanyExchangeRates', function () {
      currencyFactory.getCompanyExchangeRates();
      expect(companyExchangeRateService.getCompanyExchangeRates).toHaveBeenCalled();
    });
    it('should call companyExchangeRateService on deleteCompanyExchangeRate', function () {
      currencyFactory.deleteCompanyExchangeRate();
      expect(companyExchangeRateService.deleteCompanyExchangeRate).toHaveBeenCalled();
    });
    it('should call createCompanyExchangeRate on getCompanyExchangeRates', function () {
      currencyFactory.createCompanyExchangeRate();
      expect(companyExchangeRateService.createCompanyExchangeRate).toHaveBeenCalled();
    });
    it('should call companyExchangeRateService on updateCompanyExchangeRate', function () {
      currencyFactory.updateCompanyExchangeRate();
      expect(companyExchangeRateService.updateCompanyExchangeRate).toHaveBeenCalled();
    });
  });


});

