'use strict';

/*global moment:false */

describe('Controller: ExchangeRatesCtrl', function () {
  // load the controller's module

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
  var currencyFactory;

  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/company.json',
    'served/currencies.json',
    'served/company-currency-globals.json',
    'served/daily-exchange-rates.json',
    'served/previous-exchange-rate.json',
    'served/company-preferences.json'
  ));


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedCompany_, _servedCurrencies_, _servedCompanyCurrencyGlobals_,
                     _servedDailyExchangeRates_, _servedPreviousExchangeRate_, _servedCompanyPreferences_) {
      companyJSON = _servedCompany_;
      currenciesJSON = _servedCurrencies_;
      companyCurrencyGlobalsJSON = _servedCompanyCurrencyGlobals_;
      dailyExchangeRatesJSON = _servedDailyExchangeRates_;
      previousExchangeRatesJSON = _servedPreviousExchangeRate_;
      companyPreferencesJSON = _servedCompanyPreferences_;
    });

    $httpBackend = $injector.get('$httpBackend');
    currencyFactory = $injector.get('currencyFactory');

    saveDailyExchangeRatesDefferred = $q.defer();
    spyOn(currencyFactory, 'saveDailyExchangeRates').and.returnValue(saveDailyExchangeRatesDefferred.promise);

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

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a viewName property', function () {
    expect(scope.viewName).toBeDefined();
  });

  it('should get the company data from currencyFactory', function () {
    expect(!!scope.company).toBe(true);
  });

  it('should get the companyBaseCurrency from currencyFactory', function () {
    expect(scope.companyBaseCurrency.currencyCode).toBe('EUR');
  });

  it('should get the cashHandlerBaseCurrency from currencyFactory', function () {
    expect(scope.cashHandlerBaseCurrency.currencyCode).toBe('EUR');
  });

  it('should fetch the companyCurrencies array from API', function () {
    expect(scope.companyCurrencies.length).toBeGreaterThan(0);
  });

  it('should fetch the daily exchange rate array from API', function () {
    expect(scope.dailyExchangeRates.dailyExchangeRateCurrencies.length).toBeGreaterThan(0);
  });

  describe('company Preferences', function () {

    var preferencesJSON = [{
      'featureCode': 'EXR',
      'featureName': 'Exchange Rate',
      'optionCode': 'ERT',
      'optionName': 'Exchange Rate Type',
      'choiceCode': 'BNK',
      'choiceName': 'Bank'
    }];

    it('should attach the company preferences to scope', function () {
      expect(!!scope.companyPreferences).toBe(true);
    });

    it('should return true if BNK is found in Exchange Rate feature', function () {
      scope.companyPreferences = angular.extend(preferencesJSON);
      expect(scope.isBankExchangePreferred()).toBe(true);
    });

    it('should return false if BNK is NOT found in Exchange Rate feature', function () {
      scope.companyPreferences = angular.extend(preferencesJSON);
      scope.companyPreferences[0].choiceCode = 'Not BNK';
      expect(scope.isBankExchangePreferred()).toBe(false);
    });

    it('should return false if no preferences are defined', function () {
      scope.companyPreferences = [];
      expect(scope.isBankExchangePreferred()).toBe(false);
    });

    it('should return false if preferences is undefined or null', function () {
      scope.companyPreferences = null;
      expect(scope.isBankExchangePreferred()).toBe(false);
    });
  });

  describe('saving exchange rates', function () {

    it('should create payload with today date', function () {
      scope.checkVarianceAndSave(false);
      expect(scope.payload.dailyExchangeRate.exchangeRateDate).toBe(moment().format('YYYYMMDD').toString());
    });

    it('should only have bank Exchange Rate Currencies', function () {
      var expectedCurrencyObject = {
        retailCompanyCurrencyId: 1,
        bankExchangeRate: '0.1234'
      };
      scope.checkVarianceAndSave(false);
      expect(scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies[0]).toEqual(expectedCurrencyObject);
    });

    it('should not alert of variance', function () {
      scope.checkVarianceAndSave(false);
      expect(scope.varianceObject).toEqual([]);
    });

    it('should alert of variance > 10%', function () {
      scope.previousExchangeRates.dailyExchangeRateCurrencies[0].bankExchangeRate = '0.14191';
      scope.checkVarianceAndSave(false);

      expect(scope.varianceObject[0]).toEqual({
        code: 'USD',
        percentage: 13
      });
    });

    describe('the error handler', function () {

      var mockError = {
        status: 400,
        statusText: 'Bad Request',
        response: {
          field: 'menu date',
          code: '024'
        }
      };

      beforeEach(function () {
        scope.$digest();
        scope.saveDailyExchangeRates(true);
        saveDailyExchangeRatesDefferred.reject(mockError);
        scope.$apply();
      });

      it('should set the displayError flag to true', function () {
        expect(scope.displayError).toBeTruthy();
      });

      it('should set the errorResponse variable to API response', function () {
        expect(scope.errorResponse).toEqual(mockError);
      });

    });

  });

});

// TODO: complete tests
