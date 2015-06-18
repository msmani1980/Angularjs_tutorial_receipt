'use strict';

describe('Controller: CashBagEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json', 'served/company.json', 'served/company-currency-globals.json', 'served/daily-exchange-rates.json'));

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
    dailyExchangeRatesResponseJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();

    inject(function (_servedCashBag_, _servedCompany_, _servedCompanyCurrencyGlobals_, _servedDailyExchangeRates_) {
      cashBagResponseJSON = _servedCashBag_;
      companyResponseJSON = _servedCompany_;
      companyCurrencyGlobalsResponseJSON = _servedCompanyCurrencyGlobals_;
      dailyExchangeRatesResponseJSON = _servedDailyExchangeRates_;
    });

    cashBagFactory = $injector.get('cashBagFactory');

    getCashBagDeferred = $q.defer();
    getCashBagDeferred.resolve(cashBagResponseJSON);
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

    companyId = cashBagFactory.getCompanyId();
  }));

  describe('EDIT controller action', function () {

    beforeEach(inject(function ($controller) {
      spyOn(cashBagFactory, 'getCashBag').and.returnValue(getCashBagDeferred.promise);
      CashBagEditCtrl = $controller('CashBagEditCtrl', {
        $scope: scope,
        $routeParams: {state: 'edit', id: 95}
      });
      scope.$digest();
    }));

    it('should attach a viewName to the scope', function () {
      expect(scope.viewName).toBe('Cash Bag');
    });

    describe('cashBag object in scope', function () {
      it('should call getCashBag', function () {
        expect(cashBagFactory.getCashBag).toHaveBeenCalled();
      });
      it('should have cashBag attached to scope after API call', function () {
        expect(!!scope.cashBag).toBe(true);
      });
    });

    describe('company object in scope', function () {
      it('should call getCompany with companyId', function () {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
      });
      it('should have company attached to scope after API call', function () {
        expect(!!scope.company).toBe(true);
      });
    });

    describe('companyCurrencies in scope', function () {
      it('should call getCompanyCurrencies', function () {
        expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
      });
      it('should have companyCurrencies attached to scope after API call', function () {
        expect(!!scope.companyCurrencies).toBe(true);
      });
      it('should have currencyCodes attached to scope after API call', function () {
        expect(!!scope.currencyCodes).toBe(true);
      });
    });

    describe('update cash bag', function () {
      it('should have an update method attached to the scope', function () {
        expect(!!scope.save).toBe(true);
      });
      it('should call updateCashBag', function () {
        scope.save(cashBagResponseJSON);
        expect(cashBagFactory.updateCashBag).toHaveBeenCalled();
      });
    });

  });

  describe('create controller action', function () {

    var routeParams = {
      state: 'create',
      scheduleDate: '20151231',
      scheduleNumber: '105'
    };
    beforeEach(inject(function ($controller) {
      CashBagEditCtrl = $controller('CashBagEditCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should have cashBag defined in scope', function () {
      expect(!!scope.cashBag).toBe(true);
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

      it('should be formatted like companyCurrencies', function () {
        expect(scope.cashBag.cashBagCurrencies[0].currencyId).toEqual(companyCurrencyGlobalsResponseJSON.response[0].id);
        expect(scope.cashBag.cashBagCurrencies.length).toEqual(companyCurrencyGlobalsResponseJSON.response.length);
      });
    });

    describe('create cash bag save', function() {
      it('should have an save method attached to the scope', function () {
        expect(!!scope.save).toBe(true);
      });

      it('should be a function', function () {
        expect(Object.prototype.toString.call(scope.save)).toBe('[object Function]');
      });

      it('should call createCashBag', function () {
        scope.save(cashBagResponseJSON);
        expect(cashBagFactory.createCashBag).toHaveBeenCalled();
      });

    });

  });


});
