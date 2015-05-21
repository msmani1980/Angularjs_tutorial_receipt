'use strict';

describe('Controller: ExchangeRatesCtrl', function () {
  // load the controller's module

  var ExchangeRatesCtrl,
    scope,
    $httpBackend,
    companyJSON,
    currenciesJSON,
    companyCurrencyGlobalsJSON,
    companyPreferencesJSON,
    dailyExchangeRatesJSON;

  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/company.json',
    'served/currencies.json',
    'served/company-currency-globals.json',
    'served/daily-exchange-rates.json',
    'served/company-preferences.json'
  ));


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {
      inject(function (_servedCompany_, _servedCurrencies_, _servedCompanyCurrencyGlobals_, _servedDailyExchangeRates_, _servedCompanyPreferences_) {
        companyJSON = _servedCompany_;
        currenciesJSON = _servedCurrencies_;
        companyCurrencyGlobalsJSON = _servedCompanyCurrencyGlobals_;
        dailyExchangeRatesJSON = _servedDailyExchangeRates_;
        companyPreferencesJSON = _servedCompanyPreferences_;
      });

      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.expectGET(/company-preferences/).respond(companyPreferencesJSON);
      $httpBackend.expectGET(/companies/).respond(companyJSON);
      $httpBackend.expectGET(/companies/).respond(companyJSON);
      $httpBackend.expectGET(/company-currency-globals/).respond(companyCurrencyGlobalsJSON);
      $httpBackend.expectGET(/previous-exchange-rate/).respond(dailyExchangeRatesJSON);
      $httpBackend.expectGET(/daily-exchange-rates/).respond(dailyExchangeRatesJSON);
      $httpBackend.expectGET(/currencies/).respond(currenciesJSON);

      scope = $rootScope.$new();
      ExchangeRatesCtrl = $controller('ExchangeRatesCtrl', {
        $scope: scope
      });
      $httpBackend.flush();
    })
  );
  it('should have a viewName property', function () {
    expect(scope.viewName).toBeDefined();
  });

  it('should get the company data from currencyFactory', function () {
    expect(!!scope.company).toBe(true);
  });

  it('should get the companyBaseCurrency from currencyFactory', function () {
    expect(scope.companyBaseCurrency.currencyCode).toBe('EUR');
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

});

// TODO: complete tests
