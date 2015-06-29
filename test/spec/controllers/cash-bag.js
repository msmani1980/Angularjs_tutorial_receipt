'use strict';

describe('Controller: CashBagCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json', 'served/company.json', 'served/company-currency-globals.json', 'served/daily-exchange-rates.json', 'served/company-preferences.json'));

  var CashBagEditCtrl,
    scope,
    cashBagFactory,
    cashBagResponseJSON,
    getCashBagDeferred,
    companyId,
    companyResponseJSON,
    getCompanyDeferred,
    companyCurrencyGlobalsResponseJSON,
    getCompanyCurrenciesDeferred,
    getDailyExchangeRatesDeferred,
    dailyExchangeRatesResponseJSON,
    getCompanyPreferencesDeferred,
    getCompanyPreferencesJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();

    inject(function (_servedCashBag_, _servedCompany_, _servedCompanyCurrencyGlobals_, _servedDailyExchangeRates_, _servedCompanyPreferences_) {
      cashBagResponseJSON = _servedCashBag_;
      companyResponseJSON = _servedCompany_;
      companyCurrencyGlobalsResponseJSON = _servedCompanyCurrencyGlobals_;
      dailyExchangeRatesResponseJSON = _servedDailyExchangeRates_;
      getCompanyPreferencesJSON = _servedCompanyPreferences_;
    });

    cashBagFactory = $injector.get('cashBagFactory');

    getCashBagDeferred = $q.defer();
    getCashBagDeferred.resolve(cashBagResponseJSON);
    spyOn(cashBagFactory, 'getCashBag').and.returnValue(getCashBagDeferred.promise);
    spyOn(cashBagFactory, 'createCashBag').and.returnValue(getCashBagDeferred.promise);

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyResponseJSON);
    spyOn(cashBagFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    getCompanyCurrenciesDeferred = $q.defer();
    getCompanyCurrenciesDeferred.resolve(companyCurrencyGlobalsResponseJSON);
    spyOn(cashBagFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);

    spyOn(cashBagFactory, 'updateCashBag').and.callThrough();

    getDailyExchangeRatesDeferred = $q.defer();
    getDailyExchangeRatesDeferred.resolve(dailyExchangeRatesResponseJSON);
    spyOn(cashBagFactory, 'getDailyExchangeRates').and.returnValue(getDailyExchangeRatesDeferred.promise);

    getCompanyPreferencesDeferred = $q.defer();
    getCompanyPreferencesDeferred.resolve(getCompanyPreferencesJSON);
    spyOn(cashBagFactory, 'getCompanyPreferences').and.returnValue(getCompanyPreferencesDeferred.promise);

    companyId = cashBagFactory.getCompanyId();
  }));

  // CREATE
  describe('CREATE controller action', function () {
    var routeParams = {
      state: 'create',
      scheduleDate: '20151231',
      scheduleNumber: '105'
    };
    beforeEach(inject(function ($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('scope globals', function(){
      it('should attach a viewName to the scope', function () {
        expect(scope.viewName).toBe('Cash Bag');
      });
      it('should set the readOnly to false in scope', function () {
        expect(scope.readOnly).toEqual(false);
      });
      it('should set the displayError boolean in scope', function () {
        expect(scope.displayError).toEqual(false);
      });
      it('should have a formSave function attached to the scope', function () {
        expect(scope.formSave).toBeDefined();
        expect(Object.prototype.toString.call(scope.formSave)).toBe('[object Function]');
      });
    });

    describe('cashBagFactory API calls', function(){
      it('should call getCompany with companyId', function () {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
      });
      it('should have company attached to scope after API call', function () {
        expect(scope.company).toBeDefined();
      });
      it('should call getCompanyCurrencies', function () {
        expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
      });
      it('should have companyCurrencies attached to scope after API call', function () {
        expect(scope.companyCurrencies).toBeDefined();
      });
      it('should call getDailyExchangeRates', function () {
        expect(cashBagFactory.getDailyExchangeRates).toHaveBeenCalled();
      });
      it('should have dailyExchangeRates attached to scope after API call', function () {
        expect(scope.dailyExchangeRates).toBeDefined();
      });
      it('should call getCompanyPreferences', function(){
        expect(cashBagFactory.getCompanyPreferences).toHaveBeenCalled();
      });
    });

    describe('cashBag definition', function () {
      it('should have scheduleDate defined in cashBag', function () {
        expect(scope.cashBag.scheduleDate).toBeDefined();
        expect(scope.cashBag.scheduleDate).toEqual(routeParams.scheduleDate);
      });
      it('should have scheduleNumber defined in cashBag', function () {
        expect(scope.cashBag.scheduleNumber).toBeDefined();
        expect(scope.cashBag.scheduleNumber).toEqual(routeParams.scheduleNumber);
      });
      it('should have cashBagCurrencies in cashBag', function () {
        expect(scope.cashBag.cashBagCurrencies).toBeDefined();
      });
      it('should have cashBagCurrencies that is an array', function () {
        expect(Object.prototype.toString.call(scope.cashBag.cashBagCurrencies)).toBe('[object Array]');
      });
      // TODO handle empty company currency globals result
      it('should be formatted like companyCurrencies', function () {
        expect(scope.cashBag.cashBagCurrencies[0].currencyId).toEqual(companyCurrencyGlobalsResponseJSON.response[0].id);
        expect(scope.cashBag.cashBagCurrencies.length).toEqual(companyCurrencyGlobalsResponseJSON.response.length);
      });
    });

    describe('formSave', function() {
      it('should call cashBagFactory createCashBag', function () {
        scope.formSave(scope.cashBag);
        expect(cashBagFactory.createCashBag).toHaveBeenCalledWith({cashBag: scope.cashBag});
      });
      // TODO - test for error?
    });

  });

  // READ
  describe('READ controller action', function(){
    var routeParams = {
      state: 'view',
      id: 95
    };
    beforeEach(inject(function ($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('scope globals', function() {
      it('should attach a viewName to the scope', function () {
        expect(scope.viewName).toBe('Cash Bag');
      });
      it('should set the readOnly to true in scope', function () {
        expect(scope.readOnly).toEqual(true);
      });
      it('should set the displayError boolean in scope', function () {
        expect(scope.displayError).toEqual(false);
      });
      it('should have a formSave function attached to the scope', function () {
        expect(scope.formSave).toBeDefined();
        expect(Object.prototype.toString.call(scope.formSave)).toBe('[object Function]');
      });
    });

    describe('cashBagFactory API calls', function(){
      it('should call getCashBag', function () {
        expect(cashBagFactory.getCashBag).toHaveBeenCalled();
      });
      it('should have cashBag attached to scope after API call', function () {
        expect(scope.cashBag).toBeDefined();
      });
      it('should call getCompany with companyId', function () {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
      });
      it('should have company attached to scope after API call', function () {
        expect(scope.company).toBeDefined();
      });
      it('should call getCompanyCurrencies', function () {
        expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
      });
      it('should have companyCurrencies attached to scope after API call', function () {
        expect(scope.companyCurrencies).toBeDefined();
      });
    });

    describe('cashBag definition', function () {
      it('should have id defined cashBag', function () {
        expect(scope.cashBag.id).toBeDefined();
      });
    });
  });

  // UPDATE
  describe('UPDATE controller action', function () {
    var routeParams = {
      state: 'edit',
      id: 95
    };
    beforeEach(inject(function ($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('scope globals', function(){
      it('should attach a viewName to the scope', function () {
        expect(scope.viewName).toBe('Cash Bag');
      });
      it('should set the readOnly to false in scope', function () {
        expect(scope.readOnly).toEqual(false);
      });
      it('should set the displayError boolean in scope', function () {
        expect(scope.displayError).toEqual(false);
      });
      it('should have a formSave function attached to the scope', function () {
        expect(scope.formSave).toBeDefined();
        expect(Object.prototype.toString.call(scope.formSave)).toBe('[object Function]');
      });
    });

    describe('cashBagFactory API calls', function(){
      it('should call getCashBag', function () {
        expect(cashBagFactory.getCashBag).toHaveBeenCalled();
      });
      it('should have cashBag attached to scope after API call', function () {
        expect(scope.cashBag).toBeDefined();
      });
      it('should call getCompany with companyId', function () {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
      });
      it('should have company attached to scope after API call', function () {
        expect(scope.company).toBeDefined();
      });
      it('should call getCompanyCurrencies', function () {
        expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
      });
      it('should have companyCurrencies attached to scope after API call', function () {
        expect(scope.companyCurrencies).toBeDefined();
      });
    });

    describe('cashBag definition', function () {
      it('should have id defined cashBag', function () {
        expect(scope.cashBag.id).toBeDefined();
      });
    });

    describe('formSave', function() {
      it('should call cashBagFactory updateCashBag', function () {
        scope.formSave(scope.cashBag);
        expect(cashBagFactory.updateCashBag).toHaveBeenCalledWith(routeParams.id, {cashBag:scope.cashBag});
      });
      // TODO - test for error?
    });

  });

});
