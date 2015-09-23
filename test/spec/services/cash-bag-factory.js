'use strict';

fdescribe('Factory: cashBagFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var cashBagFactory;
  var cashBagService;
  var GlobalMenuService;
  var stationsService;
  var schedulesService;
  var rootScope;
  var scope;
  var companyService;
  var currenciesService;
  var dailyExchangeRatesService;
  var companyPreferencesService;
  var companyStoresService;

  beforeEach(inject(function ($rootScope, $injector) {
    cashBagService            = $injector.get('cashBagService');
    GlobalMenuService         = $injector.get('GlobalMenuService');
    stationsService           = $injector.get('stationsService');
    schedulesService          = $injector.get('schedulesService');
    companyService            = $injector.get('companyService');
    currenciesService         = $injector.get('currenciesService');
    dailyExchangeRatesService = $injector.get('dailyExchangeRatesService');
    companyPreferencesService = $injector.get('companyPreferencesService');
    companyStoresService      = $injector.get('companyStoresService');

    spyOn(cashBagService, 'getCashBagList');
    spyOn(GlobalMenuService.company, 'get');
    spyOn(stationsService, 'getStationList');
    spyOn(schedulesService, 'getSchedules');
    spyOn(schedulesService, 'getDailySchedules');
    spyOn(companyService, 'getCompany');
    spyOn(cashBagService, 'updateCashBag');
    spyOn(cashBagService, 'getCashBag');
    spyOn(cashBagService, 'deleteCashBag');
    spyOn(cashBagService, 'createCashBag');
    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(dailyExchangeRatesService, 'getDailyExchangeRates');
    spyOn(companyPreferencesService, 'getCompanyPreferences');
    spyOn(companyStoresService, 'getStoreList');

    rootScope      = $rootScope;
    scope          = $rootScope.$new();
    cashBagFactory = $injector.get('cashBagFactory');
  }));

  var companyId = '403';
  it('should be defined', function () {
    expect(!!cashBagFactory).toBe(true);
  });

  describe('cashBagService API', function () {
    it('should call cashBagService on getCashBagList', function () {
      cashBagFactory.getCashBagList(companyId);
      expect(cashBagService.getCashBagList).toHaveBeenCalledWith(companyId);
    });
    it('should call cashBagService updateCashBag', function () {
      var id      = 1;
      var payload = {t: 123, d: 323};
      cashBagFactory.updateCashBag(id, payload);
      expect(cashBagService.updateCashBag).toHaveBeenCalledWith(id, payload);
    });
    it('should call cashBagService getCashBag', function () {
      var id = 123;
      cashBagFactory.getCashBag(id);
      expect(cashBagService.getCashBag).toHaveBeenCalledWith(id);
    });
    it('should call cashBagService deleteCashBag', function () {
      var id = 123;
      cashBagFactory.deleteCashBag(id);
      expect(cashBagService.deleteCashBag).toHaveBeenCalledWith(id);
    });
    it('should call cashBagService createCashBag', function () {
      var cashBag = {
        scheduleDate: '20150611',
        scheduleNumber: '105',
        cashBagCurrencies: []
      };
      cashBagFactory.createCashBag(cashBag);
      expect(cashBagService.createCashBag).toHaveBeenCalledWith(cashBag);
    });
  });

  describe('companyStoresService API', function () {
    it('should call companyStoresService on getStoreList', function () {
      cashBagFactory.getStoreList(companyId);
      expect(companyStoresService.getStoreList).toHaveBeenCalledWith(companyId);
    });
  });

  describe('stationsService API', function () {
    it('should call stationsService on getStationService', function () {
      cashBagFactory.getStationList(companyId);
      expect(stationsService.getStationList).toHaveBeenCalledWith(companyId);
    });
  });

  describe('schedulesService API', function () {
    it('should call schedulesService on getSchedules', function () {
      cashBagFactory.getSchedulesList(companyId);
      expect(schedulesService.getSchedules).toHaveBeenCalledWith(companyId);
    });
    it('should call schedulesService on getDailySchedules', function () {
      var dummyParams = '123';
      cashBagFactory.getDailySchedulesList(companyId, dummyParams, dummyParams);
      expect(schedulesService.getDailySchedules).toHaveBeenCalledWith(companyId, dummyParams, dummyParams);
    });
  });

  describe('GlobalMenuService API', function () {
    it('should call globalMenuService on company.get', function () {
      cashBagFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });

  describe('companyService API', function () {
    it('should call getCompany', function () {
      var id = 1;
      cashBagFactory.getCompany(id);
      expect(companyService.getCompany).toHaveBeenCalledWith(id);
    });
  });

  describe('currenciesService API', function () {
    it('should call getCompanyCurrencies', function () {
      cashBagFactory.getCompanyCurrencies();
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalled();
    });
  });

  describe('dailyExchangeRatesService API', function () {
    it('should call getDailyExchangeRates', function () {
      var companyId   = '403';
      var cashierDate = '20150617';
      cashBagFactory.getDailyExchangeRates(companyId, cashierDate);
      expect(dailyExchangeRatesService.getDailyExchangeRates).toHaveBeenCalledWith(companyId, cashierDate);
    });
  });

  describe('company preferences API', function () {
    it('should call getCompanyPreferences', function () {
      cashBagFactory.getCompanyPreferences();
      expect(companyPreferencesService.getCompanyPreferences).toHaveBeenCalled();
    });
  });

});
