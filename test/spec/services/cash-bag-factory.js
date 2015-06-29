'use strict';

describe('Factory: cashBagFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var cashBagFactory,
    cashBagService,
    GlobalMenuService,
    stationsService,
    schedulesService,
    rootScope,
    scope,
    companyService,
    currenciesService,
    dailyExchangeRatesService,
    companyPreferencesService;

  beforeEach(inject(function ($rootScope, _cashBagFactory_, _cashBagService_, _GlobalMenuService_, _stationsService_, _schedulesService_, _companyService_, _currenciesService_, _dailyExchangeRatesService_, _companyPreferencesService_) {
    cashBagService = _cashBagService_;
    GlobalMenuService = _GlobalMenuService_;
    stationsService = _stationsService_;
    schedulesService = _schedulesService_;
    companyService = _companyService_;
    currenciesService = _currenciesService_;
    dailyExchangeRatesService = _dailyExchangeRatesService_;
    companyPreferencesService = _companyPreferencesService_;

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

    rootScope = $rootScope;
    scope = $rootScope.$new();
    cashBagFactory = _cashBagFactory_;
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
    it('should call cashBagService updateCashBag', function(){
      var id = 1;
      var payload = {t:123,d:323};
      cashBagFactory.updateCashBag(id, payload);
      expect(cashBagService.updateCashBag).toHaveBeenCalledWith(id, payload);
    });
    it('should call cashBagService getCashBag', function(){
      var id = 123;
      cashBagFactory.getCashBag(id);
      expect(cashBagService.getCashBag).toHaveBeenCalledWith(id);
    });
    it('should call cashBagService deleteCashBag', function(){
      var id = 123;
      cashBagFactory.deleteCashBag(id);
      expect(cashBagService.deleteCashBag).toHaveBeenCalledWith(id);
    });
    it('should call cashBagService createCashBag', function(){
      var cashBag = {
        scheduleDate: '20150611',
        scheduleNumber: '105',
        cashBagCurrencies: []
      };
      cashBagFactory.createCashBag(cashBag);
      expect(cashBagService.createCashBag).toHaveBeenCalledWith(cashBag);
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

  describe('companyService API', function() {
    it('should call getCompany', function() {
      var id = 1;
      cashBagFactory.getCompany(id);
      expect(companyService.getCompany).toHaveBeenCalledWith(id);
    });
  });

  describe('currenciesService API', function(){
    it('should call getCompanyCurrencies', function(){
      cashBagFactory.getCompanyCurrencies();
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalled();
    });
  });

  describe('dailyExchangeRatesService API', function() {
    it('should call getDailyExchangeRates', function () {
      var companyId = '403';
      var cashierDate = '20150617';
      cashBagFactory.getDailyExchangeRates(companyId, cashierDate);
      expect(dailyExchangeRatesService.getDailyExchangeRates).toHaveBeenCalledWith(companyId, cashierDate);
    });
  });

  describe('company preferences API', function() {
    it('should call getCompanyPreferences', function(){
      cashBagFactory.getCompanyPreferences();
      expect(companyPreferencesService.getCompanyPreferences).toHaveBeenCalled();
    });
  });

});
