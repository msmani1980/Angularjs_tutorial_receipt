'use strict';
/*global moment:false */

describe('Controller: ExchangeRatesCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/currencies.json'));
  beforeEach(module('served/company-currency-globals.json'));
  beforeEach(module('served/daily-exchange-rates.json'));
  beforeEach(module('served/previous-exchange-rate.json'));
  beforeEach(module('served/company-preferences.json'));
  beforeEach(module('served/company-data.json'));
  beforeEach(module('served/threshold-list.json'));

  var ExchangeRatesCtrl;
  var scope;
  var $httpBackend;
  var companyJSON;
  var currenciesJSON;
  var companyCurrencyGlobalsJSON;
  var companyPreferencesJSON;
  var dailyExchangeRatesJSON;
  var previousExchangeRatesJSON;
  var saveDailyExchangeRatesDefferred;
  var thresholdListDeferred;
  var thresholdListResponseJSON;
  var currencyFactory;
  var dateUtility;
  var globalMenuService;
  var servedCompanyDataJSON;


  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    inject(function(_servedCompany_, _servedCurrencies_, _servedCompanyCurrencyGlobals_,
      _servedDailyExchangeRates_, _servedPreviousExchangeRate_, _servedCompanyPreferences_, _servedThresholdList_) {
      companyJSON = _servedCompany_;
      currenciesJSON = _servedCurrencies_;
      companyCurrencyGlobalsJSON = _servedCompanyCurrencyGlobals_;
      dailyExchangeRatesJSON = _servedDailyExchangeRates_;
      previousExchangeRatesJSON = _servedPreviousExchangeRate_;
      companyPreferencesJSON = _servedCompanyPreferences_;
      thresholdListResponseJSON = _servedThresholdList_;
    });

    var rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    currencyFactory = $injector.get('currencyFactory');
    dateUtility = $injector.get('dateUtility');

    servedCompanyDataJSON = $injector.get('servedCompanyData');
    globalMenuService = $injector.get('globalMenuService');
    spyOn(globalMenuService, 'getCompanyData').and.returnValue(servedCompanyDataJSON);

    saveDailyExchangeRatesDefferred = $q.defer();
    spyOn(currencyFactory, 'saveDailyExchangeRates').and.returnValue(saveDailyExchangeRatesDefferred.promise);

    thresholdListDeferred = $q.defer();
    thresholdListDeferred.resolve(thresholdListResponseJSON);
    spyOn(currencyFactory, 'getExchangeRateThresholdList').and.returnValue(thresholdListDeferred.promise);

    spyOn(rootScope, '$broadcast').and.returnValue({});

    $httpBackend.whenGET(/company-preferences/).respond(companyPreferencesJSON);
    $httpBackend.whenGET(/companies/).respond(companyJSON);
    $httpBackend.whenGET(/company-currency-globals/).respond(companyCurrencyGlobalsJSON);
    $httpBackend.whenGET(/previous-exchange-rate/).respond(previousExchangeRatesJSON);
    $httpBackend.whenGET(/daily-exchange-rates/).respond(dailyExchangeRatesJSON);
    $httpBackend.whenPUT(/daily-exchange-rates/).respond(dailyExchangeRatesJSON);
    $httpBackend.whenGET(/currencies/).respond(currenciesJSON);

    scope = $rootScope.$new();

    ExchangeRatesCtrl = $controller('ExchangeRatesCtrl', {
      $scope: scope
    });
    spyOn(scope, 'isBankExchangePreferred').and.callThrough();
    scope.dailyExchangeRatesForm = {
      $valid: true
    };
    $httpBackend.flush();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a viewName property', function() {
    expect(scope.viewName).toBeDefined();
  });

  it('should get the company data from currencyFactory', function() {
    expect(!!scope.company).toBe(true);
  });

  it('should get the companyBaseCurrency from currencyFactory', function() {
    expect(scope.companyBaseCurrency.currencyCode).toBe('EUR');
  });

  it('should get the cashHandlerBaseCurrency from currencyFactory', function() {
    expect(scope.cashHandlerBaseCurrency.currencyCode).toBe('EUR');
  });

  it('should fetch the companyCurrencies array from API', function() {
    expect(scope.companyCurrencies.length).toBeGreaterThan(0);
  });

  it('should fetch the daily exchange rate array from API', function() {
    expect(scope.dailyExchangeRates.dailyExchangeRateCurrencies.length).toBeGreaterThan(0);
  });

  it('should default cash handler base currency to 1', function() {
    var cashHandlerBaseCurrency = 'EUR';
    expect(scope.currenciesFields[cashHandlerBaseCurrency].bankExchangeRate).toEqual('1.0000');
  });

  describe('company Preferences', function() {

    var preferencesJSON = {
      exchangeRateType: {
        choiceCode: 'BNK',
        featureName: 'Exchange Rate',
        optionName: 'Exchange Rate Type',
        startDate: '2016-02-01'
      }
    };

    it('should attach the company preferences to scope', function() {
      expect(!!scope.companyPreferences).toBe(true);
    });

    it('should return true if BNK is found in Exchange Rate feature', function() {
      scope.companyPreferences = angular.extend(preferencesJSON);
      expect(scope.isBankExchangePreferred()).toBe(true);
    });

    it('should return false if BNK is NOT found in Exchange Rate feature', function() {
      scope.companyPreferences = angular.copy(preferencesJSON);
      scope.companyPreferences.exchangeRateType.choiceCode = 'Not BNK';
      expect(scope.isBankExchangePreferred()).toBe(false);
    });

    it('should return false if no preferences are defined', function() {
      scope.companyPreferences = [];
      expect(scope.isBankExchangePreferred()).toBe(false);
    });

    it('should return false if preferences is undefined or null', function() {
      scope.companyPreferences = null;
      expect(scope.isBankExchangePreferred()).toBe(false);
    });
  });

  describe('get Threshold Variance', function () {
    it('should get active records from API', function () {
      var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
      var expectedPayload = { startDate: today, endDate: today };
      var expectedRetailCompanyId = servedCompanyDataJSON.chCompany.companyId;

      expect(currencyFactory.getExchangeRateThresholdList).toHaveBeenCalledWith(expectedPayload, expectedRetailCompanyId);
    });
    it('should save threshold to scope', function () {
      expect(scope.percentThreshold).toBeDefined();
    });

  });

  describe('saving exchange rates', function() {

    it('should create payload with today date', function() {
      scope.checkVarianceAndSave(false);
      expect(scope.payload.exchangeRateDate).toBe(moment().format('YYYYMMDD').toString());
    });

    it('should create payload with company data', function() {
      scope.checkVarianceAndSave(false);
      expect(scope.payload.chCompanyId).toBeTruthy();
      expect(scope.payload.retailCompanyId).toBeTruthy();
      expect(scope.payload.chBaseCurrencyId).toBeTruthy();
      expect(scope.payload.retailBaseCurrencyId).toBeTruthy();
    });

    it('should only have bank Exchange Rate Currencies', function() {
      var expectedCurrencyObject = {
        retailCompanyCurrencyId: 1,
        bankExchangeRate: '0.1234'
      };
      scope.checkVarianceAndSave(false);
      expect(scope.payload.dailyExchangeRateCurrencies[0]).toEqual(expectedCurrencyObject);
    });

    it('should not alert of variance', function() {
      scope.checkVarianceAndSave(false);
      expect(scope.varianceObject).toEqual([]);
    });

    it('should alert of variance > 10%', function() {
      scope.previousExchangeRates.dailyExchangeRateCurrencies[0].bankExchangeRate = '0.14191';
      scope.checkVarianceAndSave(false);

      expect(scope.varianceObject[0]).toEqual({
        code: 'USD',
        percentage: 13
      });
    });

    describe('the error handler', function() {

      var mockError = {
        status: 400,
        statusText: 'Bad Request',
        response: {
          field: 'menu date',
          code: '024'
        }
      };

      beforeEach(function() {
        scope.$digest();
        scope.saveDailyExchangeRates(true);
        saveDailyExchangeRatesDefferred.reject(mockError);
        scope.$apply();
      });

      it('should set the displayError flag to true', function() {
        expect(scope.displayError).toBeTruthy();
      });

      it('should set the errorResponse variable to API response', function() {
        expect(scope.errorResponse).toEqual(mockError);
      });

    });

  });

});

// TODO: complete tests
