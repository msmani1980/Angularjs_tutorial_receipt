'use strict';

describe('Controller: CashBagCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/company-currency-globals.json'));
  beforeEach(module('served/daily-exchange-rates.json'));
  beforeEach(module('served/daily-exchange-rate.json'));
  beforeEach(module('served/company-preferences.json'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/store.json'));

  var CashBagEditCtrl;
  var scope;
  var cashBagFactory;
  var companyId;
  var dateUtility;
  var localStorage;
  var lodash;

  var getCashBagDeferred;
  var getCompanyDeferred;
  var getCompanyCurrenciesDeferred;
  var getDailyExchangeRatesDeferred;
  var getDailyExchangeRateByIdDeferred;
  var getCompanyPreferencesDeferred;
  var getStoreInstanceDeferred;
  var getStoreListDeferred;

  var cashBagResponseJSON;
  var companyResponseJSON;
  var currencyGlobalsResponseJSON;
  var dailyExchangeRatesResponseJSON;
  var dailyExchangeRateByIdJSON;
  var getCompanyPreferencesJSON;
  var getStoreInstanceJSON;
  var getStoreListJSON;

  var checkForDailyExchangeRate;

  beforeEach(inject(function($controller, $rootScope, $q, _cashBagFactory_, $injector) {
    scope = $rootScope.$new();

    inject(function(_servedCashBag_, _servedCompany_, _servedCompanyCurrencyGlobals_,
      _servedDailyExchangeRates_, _servedDailyExchangeRate_, _servedCompanyPreferences_,
      _servedStoreInstance_,
      _servedStore_) {
      cashBagResponseJSON = angular.copy(_servedCashBag_);
      companyResponseJSON = _servedCompany_;
      currencyGlobalsResponseJSON = _servedCompanyCurrencyGlobals_;
      dailyExchangeRatesResponseJSON = _servedDailyExchangeRates_;
      dailyExchangeRateByIdJSON = _servedDailyExchangeRate_;
      getCompanyPreferencesJSON = _servedCompanyPreferences_;
      getStoreInstanceJSON = _servedStoreInstance_;
      getStoreListJSON = _servedStore_;
    });


    // mock currency with no matching exchange rate
    cashBagResponseJSON.cashBagCurrencies.push({
      id: 481,
      bankAmount: '1.0000',
      coinAmountEpos: null,
      coinAmountManual: '.50',
      companyCashBagId: 95,
      paperAmountEpos: null,
      paperAmountManual: null,
      currencyId: 63
    });


    cashBagFactory = _cashBagFactory_;
    dateUtility = $injector.get('dateUtility');
    localStorage = $injector.get('$localStorage');
    lodash = $injector.get('lodash');


    getCashBagDeferred = $q.defer();
    getCashBagDeferred.resolve(cashBagResponseJSON);
    spyOn(cashBagFactory, 'getCashBag').and.returnValue(getCashBagDeferred.promise);
    spyOn(cashBagFactory, 'createCashBag').and.returnValue(getCashBagDeferred.promise);

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyResponseJSON);
    spyOn(cashBagFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    getCompanyCurrenciesDeferred = $q.defer();
    getCompanyCurrenciesDeferred.resolve(currencyGlobalsResponseJSON);
    spyOn(cashBagFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);

    spyOn(cashBagFactory, 'updateCashBag').and.callThrough();

    getDailyExchangeRatesDeferred = $q.defer();
    getDailyExchangeRatesDeferred.resolve(dailyExchangeRatesResponseJSON);
    spyOn(cashBagFactory, 'getDailyExchangeRates').and.returnValue(getDailyExchangeRatesDeferred.promise);

    getDailyExchangeRateByIdDeferred = $q.defer();
    getDailyExchangeRateByIdDeferred.resolve(dailyExchangeRateByIdJSON);
    spyOn(cashBagFactory, 'getDailyExchangeById').and.returnValue(getDailyExchangeRateByIdDeferred.promise);

    getCompanyPreferencesDeferred = $q.defer();
    getCompanyPreferencesDeferred.resolve(getCompanyPreferencesJSON);
    spyOn(cashBagFactory, 'getCompanyPreferences').and.returnValue(getCompanyPreferencesDeferred.promise);

    getStoreInstanceDeferred = $q.defer();
    getStoreInstanceDeferred.resolve(getStoreInstanceJSON);
    spyOn(cashBagFactory, 'getStoreInstance').and.returnValue(getStoreInstanceDeferred.promise);

    getStoreListDeferred = $q.defer();
    getStoreListDeferred.resolve(getStoreListJSON);
    spyOn(cashBagFactory, 'getStoreList').and.returnValue(getStoreListDeferred.promise);

    spyOn(cashBagFactory, 'deleteCashBag').and.returnValue(getCompanyDeferred.promise);

    companyId = 403;
    spyOn(cashBagFactory, 'getCompanyId').and.returnValue(companyId);

    localStorage.cashBagBankRefNumber = 12345;

    checkForDailyExchangeRate = $q.defer();
    checkForDailyExchangeRate.resolve({});
    scope.checkForDailyExchangeRate = function() {
      return checkForDailyExchangeRate.promise;
    };
  }));

  // CREATE
  describe('CREATE controller action', function() {
    var routeParams = {
      state: 'create',
      id: 95
    };
    beforeEach(inject(function($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('scope globals', function() {
      it('should attach a viewName to the scope', function() {
        expect(scope.viewName).toBe('Cash Bag');
      });

      it('should set the readOnly to false in scope', function() {
        expect(scope.readOnly).toEqual(false);
      });

      it('should set the displayError boolean in scope', function() {
        expect(scope.displayError).toEqual(false);
      });

      it('should have a formSave function attached to the scope', function() {
        expect(scope.formSave).toBeDefined();
        expect(Object.prototype.toString.call(scope.formSave)).toBe('[object Function]');
      });

      it('should have a removeRecord function attached to the scope', function() {
        expect(scope.removeRecord).toBeDefined();
        expect(Object.prototype.toString.call(scope.removeRecord)).toBe('[object Function]');
      });

      it('should have a isBankExchangePreferred function attached to the scope', function() {
        expect(scope.isBankExchangePreferred).toBeDefined();
        expect(Object.prototype.toString.call(scope.isBankExchangePreferred)).toBe('[object Function]');
      });

      it('should have a cashBagNumberMaxLength variable attached to scope', function () {
        expect(scope.cashBagNumberMaxLength).toBeTruthy();
      });
    });

    describe('cashBagFactory API calls', function() {
      it('should call getCompany with companyId', function() {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
      });

      it('should have company attached to scope after API call', function() {
        expect(scope.company).toBeDefined();
      });

      it('should call getCompanyCurrencies', function() {
        expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
      });

      it('should have companyCurrencies attached to scope after API call', function() {
        expect(scope.companyCurrencies).toBeDefined();
      });

      it('should call getDailyExchangeRates', function() {
        expect(cashBagFactory.getDailyExchangeRates).toHaveBeenCalled();
      });

      it('should have dailyExchangeRates attached to scope after API call', function() {
        expect(scope.dailyExchangeRates).toBeDefined();
      });

      it('should call getCompanyPreferences', function() {
        var expectedPayload = {
          startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
        };
        expect(cashBagFactory.getCompanyPreferences).toHaveBeenCalledWith(expectedPayload, 403);
        scope.$digest();
        expect(scope.companyPreferences.defaultBankRefNumber).toBeDefined();
        expect(scope.companyPreferences.cashbagNumberLength).toBeDefined();
      });

      it('shoudl save latest company preference', function () {
        scope.$digest();
        var expectedStartDateFromJSONMock = '2016-02-23';
        expect(scope.companyPreferences.defaultBankRefNumber.startDate).toEqual(expectedStartDateFromJSONMock);
      });
    });

    describe('cashBag definition', function() {
      it('should have scheduleDate defined in cashBag', function() {
        expect(scope.cashBag.scheduleDate).toBeDefined();
      });

      it('should have scheduleNumber defined in cashBag', function() {
        expect(scope.cashBag.scheduleNumber).toEqual(getStoreInstanceJSON.scheduleNumber);
      });

      it('should have cashBagCurrencies in cashBag', function() {
        expect(scope.cashBag.cashBagCurrencies).toBeDefined();
      });

      it('should have cashBagCurrencies that is an array', function() {
        expect(angular.isArray(scope.cashBag.cashBagCurrencies)).toBe(true);
      });

      it('should format cashBagCurrencies with currency code', function() {
        expect(scope.cashBag.cashBagCurrencies[0].currencyCode).toBeDefined();
        expect(scope.cashBag.cashBagCurrencies[0]).not.toEqual(null);
      });

      it('should be formatted like companyCurrencies', function() {
        expect(scope.cashBag.cashBagCurrencies[0].currencyId).toEqual(currencyGlobalsResponseJSON.response[
          0].id);
        expect(scope.cashBag.cashBagCurrencies.length).toEqual(currencyGlobalsResponseJSON.response.length);
      });

      it('should default bank ref number from localStorage', function() {
        expect(scope.cashBag.bankReferenceNumber).toEqual(12345);
      });
    });

    describe('formSave form action', function() {
      beforeEach(function() {
        scope.cashBagCreateForm = {
          $invalid: false
        };
      });

      it('should not save if the cash bag has no cash', function () {
        scope.cashBag = {
          cashBagCurrencies: [{
            paperAmount: '0.000',
            coinAmount: '0.000'
          }]
        };

        scope.formSave();
        expect(scope.displayError).toEqual(true);
        expect(scope.errorCustom !== null && angular.isDefined(scope.errorCustom)).toEqual(true);
      });

      it('should call cashBagFactory createCashBag', function() {
        scope.cashBag.cashBagCurrencies[0].paperAmountManual = '1.0000';
        var payload = angular.copy(scope.cashBag);
        payload.scheduleDate='20150930';
        payload.isRemoved=false;
        payload.isDeleted=false;
        delete payload.storeNumber;
        angular.forEach(payload.cashBagCurrencies, function(cashBagCurrency) {
          delete cashBagCurrency.currencyCode;
          delete cashBagCurrency.bankAmount;
          delete cashBagCurrency.flightAmount;
          delete cashBagCurrency.paperExchangeRate;
          delete cashBagCurrency.coinExchangeRate;
          delete cashBagCurrency.bankExchangeRate;
        });

        var expectedPayload = payload;

        scope.formSave(scope.cashBag);
        expect(cashBagFactory.createCashBag).toHaveBeenCalledWith(expectedPayload);
      });

      it('should save bank ref number to localStorage', function() {
        scope.cashBag.cashBagCurrencies[0].paperAmountManual = '1.0000';
        scope.cashBag.bankReferenceNumber = 4567;
        scope.formSave(scope.cashBag);
        expect(localStorage.cashBagBankRefNumber).toEqual(4567);
      });
    });

  });

  // READ
  describe('READ controller action', function() {
    var routeParams = {
      state: 'view',
      id: 95
    };
    beforeEach(inject(function($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('scope globals', function() {
      it('should attach a viewName to the scope', function() {
        expect(scope.viewName).toBe('Cash Bag');
      });

      it('should set the readOnly to true in scope', function() {
        expect(scope.readOnly).toEqual(true);
      });

      it('should set the displayError boolean in scope', function() {
        expect(scope.displayError).toEqual(false);
      });

      it('should have a formSave function attached to the scope', function() {
        expect(scope.formSave).toBeDefined();
        expect(Object.prototype.toString.call(scope.formSave)).toBe('[object Function]');
      });
    });

    describe('cashBagFactory API calls', function() {
      it('should call getCashBag', function() {
        expect(cashBagFactory.getCashBag).toHaveBeenCalled();
      });

      it('should have cashBag attached to scope after API call', function() {
        expect(scope.cashBag).toBeDefined();
      });

      it('should call getCompany with companyId', function() {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
      });

      it('should have company attached to scope after API call', function() {
        expect(scope.company).toBeDefined();
      });

      it('should call getCompanyCurrencies', function() {
        expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
      });

      it('should have companyCurrencies attached to scope after API call', function() {
        expect(scope.companyCurrencies).toBeDefined();
      });
    });

    describe('cashBag definition', function() {
      it('should have id defined cashBag', function() {
        expect(scope.cashBag.id).toBeDefined();
      });

      it('should format cashBagCurrencies with currency code', function() {
        expect(scope.cashBag.cashBagCurrencies[0].currencyCode).toBeDefined();
        expect(scope.cashBag.cashBagCurrencies[0]).not.toEqual(null);
      });
    });

    describe('isCashBagDeleted', function() {
      it('should return true if cash bag has been deleted', function() {
        scope.cashBag = {};
        scope.cashBag.isDelete = true;
        expect(scope.isCashBagDeleted()).toEqual(true);
        scope.cashBag.isDelete = false;
        expect(scope.isCashBagDeleted()).toEqual(false);
      });
    });
  });

  // UPDATE
  describe('UPDATE controller action', function() {
    var routeParams = {
      state: 'edit',
      id: 95
    };
    beforeEach(inject(function($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('scope globals', function() {
      it('should attach a viewName to the scope', function() {
        expect(scope.viewName).toBe('Cash Bag');
      });

      it('should set the readOnly to false in scope', function() {
        expect(scope.readOnly).toEqual(false);
      });

      it('should set the displayError boolean in scope', function() {
        expect(scope.displayError).toEqual(false);
      });

      it('should have a formSave function attached to the scope', function() {
        expect(scope.formSave).toBeDefined();
        expect(Object.prototype.toString.call(scope.formSave)).toBe('[object Function]');
      });

      it('should have a cashBagNumberMaxLength variable attached to scope', function () {
        expect(scope.cashBagNumberMaxLength).toBeTruthy();
      });
    });

    describe('cashBagFactory API calls', function() {
      it('should call getCashBag', function() {
        expect(cashBagFactory.getCashBag).toHaveBeenCalled();
      });

      it('should have cashBag attached to scope after API call', function() {
        expect(scope.cashBag).toBeDefined();
      });

      it('should call getCompany with companyId', function() {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
      });

      it('should have company attached to scope after API call', function() {
        expect(scope.company).toBeDefined();
      });

      it('should call getCompanyCurrencies', function() {
        expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
      });

      it('should have companyCurrencies attached to scope after API call', function() {
        expect(scope.companyCurrencies).toBeDefined();
      });

      it('should call getCompanyPreferences', function() {
        var expectedPayload = {
          startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
        };
        expect(cashBagFactory.getCompanyPreferences).toHaveBeenCalledWith(expectedPayload, 403);
        scope.$digest();
        expect(scope.companyPreferences.defaultBankRefNumber).toBeDefined();
        expect(scope.companyPreferences.cashbagNumberLength).toBeDefined();
      });
    });

    describe('cashBag definition', function() {
      it('should have id defined cashBag', function() {
        expect(scope.cashBag.id).toBeDefined();
      });

      it('should format cashBagCurrencies with currency code', function() {
        expect(scope.cashBag.cashBagCurrencies[0].currencyCode).toBeDefined();
        expect(scope.cashBag.cashBagCurrencies[0]).not.toEqual(null);
      });

      it('should default bank ref number from localStorage', function() {
        expect(scope.cashBag.bankReferenceNumber).toEqual(12345);
      });

      it('should have all saved values, even if exchange rate does not exist for the currency', function () {
        var expectedCurrencyIdWithNoExchangeRate = 63;  // currency in cash-bag.json, but not daily-exchange-rate.json
        var cashBagCurrencyMatch = lodash.findWhere(scope.cashBag.cashBagCurrencies, {currencyId: expectedCurrencyIdWithNoExchangeRate});
        expect(cashBagCurrencyMatch).toBeDefined();
      });

      it('should have all exchange rate currencies, even if a value does not exist for the exchange rate', function () {
        var expectedCurrencyIdWithNoCashBagAmount = 23; // currency in daily-exchange-rate.json, but not cash-bag.json
        var cashBagCurrencyMatch = lodash.findWhere(scope.cashBag.cashBagCurrencies, {currencyId: expectedCurrencyIdWithNoCashBagAmount});
        expect(cashBagCurrencyMatch).toBeDefined();
      });

      it('should not include a currency if it has no exchange rate or saved amount', function () {
        var expectedCurrencyIdWithNoAmountOrExchangeRate = 58; // currency not in cash-bag.json or daily-exchange-rate.json
        var cashBagCurrencyMatch = lodash.findWhere(scope.cashBag.cashBagCurrencies, {currencyId: expectedCurrencyIdWithNoAmountOrExchangeRate});
        expect(cashBagCurrencyMatch).not.toBeDefined();
      });
    });

    describe('formSave', function() {
      beforeEach(function() {
        scope.cashBagCreateForm = {
          $invalid: false
        };
      });

      it('should call cashBagFactory updateCashBag', function() {
        scope.formSave(scope.cashBag);
        expect(cashBagFactory.updateCashBag.calls.mostRecent().args[0]).toBe(95);
      });

      it('should save bank ref number to localStorage', function() {
        scope.cashBag.bankReferenceNumber = 4567;
        scope.formSave(scope.cashBag);
        expect(localStorage.cashBagBankRefNumber).toEqual(4567);
      });

    });

  });

  describe('removeRecord scope function cannot delete', function() {
    beforeEach(inject(function($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: {
          state: 'view',
          id: 95
        }
      });
      scope.$digest();
    }));

    it('should return false if state is not edit', function() {
      scope.state = 'view';
      scope.$digest();
      expect(scope.removeRecord({})).toBe(false);
    });

    it('should return false if readOnly is true', function() {
      scope.state = 'edit';
      scope.readOnly = true;
      scope.$digest();
      expect(scope.removeRecord({})).toBe(false);
    });

    it('should return false if cashBag has a property isSubmitted which is set to string value true', function() {
      scope.state = 'edit';
      scope.readOnly = false;
      scope.$digest();
      expect(scope.removeRecord({
        isSubmitted: true
      })).toBe(false);
    });

    it('should return false if cashBag has a property isDelete which is set to string value true', function() {
      scope.state = 'edit';
      scope.readOnly = false;
      scope.$digest();
      expect(scope.removeRecord({
        isDelete: true
      })).toBe(false);
    });

    it(
      'should return false if a cashBag has a cashBagCurrencies.bankAmount value set to a value and not 0.0000',
      function() {
        var cashBag = {
          cashBagCurrencies: [{
            bankAmount: '1.000'
          }]
        };
        scope.state = 'edit';
        scope.readOnly = false;
        scope.$digest();
        expect(scope.removeRecord(cashBag)).toBe(false);
      });

    it('should return false if a cashBag has a cashBagCurrencies.coinAmountManual that is not null', function() {
      var cashBag = {
        cashBagCurrencies: [{
          bankAmount: null,
          coinAmountManual: '1'
        }]
      };
      scope.state = 'edit';
      scope.readOnly = false;
      scope.$digest();
      expect(scope.removeRecord(cashBag)).toBe(false);
    });

    it('should return false if a cashBag has a cashBagCurrencies.paperAmountManual that is not null', function() {
      var cashBag = {
        cashBagCurrencies: [{
          bankAmount: '0.000',
          coinAmountManual: null,
          paperAmountManual: '1'
        }]
      };
      scope.state = 'edit';
      scope.readOnly = false;
      scope.$digest();
      expect(scope.removeRecord(cashBag)).toBe(false);
    });
  });

  describe('removeRecord scope function', function() {
    beforeEach(inject(function($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: {
          state: 'edit',
          id: 95
        }
      });
      scope.$digest();
    }));

    it('should call deleteCashBag with ID passed to scope function', function() {
      var cbid = 503;
      var cashBag = {
        id: cbid,
        cashBagCurrencies: [{
          bankAmount: null,
          coinAmountManual: null,
          paperAmountManual: null
        }]
      };
      scope.removeRecord(cashBag);
      expect(cashBagFactory.deleteCashBag).toHaveBeenCalledWith(cbid);
    });

    it('should return false if cannot delete', function() {
      scope.state = 'view';
      scope.$digest();
      expect(scope.removeRecord({})).toBe(false);
    });
  });

  describe('isBankExchangePreferred scope function', function() {
    beforeEach(inject(function($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: {
          state: 'edit',
          id: 95
        }
      });
      scope.$digest();
    }));

    it('should return false if companyPreferences is set to false', function() {
      scope.companyPreferences = false;
      scope.$digest();
      expect(scope.isBankExchangePreferred()).toBe(false);
    });
  });

  describe('isTotalNumberOfCashBagsActivated scope function', function() {
    beforeEach(inject(function($controller) {
      CashBagEditCtrl = $controller('CashBagCtrl', {
        $scope: scope,
        $routeParams: {
          state: 'edit',
          id: 95
        }
      });
      scope.$digest();
    }));

    it('should return false if companyPreferences is set to false', function() {
      scope.companyPreferences = false;
      scope.$digest();
      expect(scope.isTotalNumberOfCashBagsActivated()).toBe(false);
    });

    it('should return true if total number of cash bags is activated', function() {
      scope.companyPreferences = {
        exchangeRateType: {
          isSelected: true,
          choiceCode: 'BNK'
        },
        totalNumberOfCashBags: {
          isSelected: true,
          choiceCode: 'CSB'
        }
      };
      scope.$digest();

      expect(scope.isTotalNumberOfCashBagsActivated()).toBe(true);
    });

    it('should return false if total number of cash bags is not activated', function() {
      scope.companyPreferences = {
        exchangeRateType: {
          isSelected: true,
          choiceCode: 'BNK'
        },
        totalNumberOfCashBags: {
          isSelected: false,
          choiceCode: 'CSB'
        }
      };
      scope.$digest();

      expect(scope.isTotalNumberOfCashBagsActivated()).toBe(false);
    });

    it('should return false if total number of cash bags is not activated', function() {
      scope.companyPreferences = {
        exchangeRateType: {
          isSelected: true,
          choiceCode: 'BNK'
        },
        totalNumberOfCashBags: {
          isSelected: false,
          choiceCode: 'CSB'
        }
      };
      scope.$digest();

      expect(scope.isTotalNumberOfCashBagsActivated()).toBe(false);
    });

    it('should return false if total number of cash bags is not activated', function() {
      scope.companyPreferences = {
        exchangeRateType: {
          isSelected: true,
          choiceCode: 'BNK'
        },
        totalNumberOfCashBags: {
          isSelected: true,
          choiceCode: 'XYZ'
        }
      };
      scope.$digest();

      expect(scope.isTotalNumberOfCashBagsActivated()).toBe(false);
    });
  });
});
