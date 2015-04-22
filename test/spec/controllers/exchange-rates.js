'use strict';

describe('Controller: ExchangeRatesCtrl', function () {
  // load the controller's module

  var ExchangeRatesCtrl,
    scope,
    createController,
    currencyFactory,
    getCompanyBaseCurrencyDeferred,
    getCompanyCurrenciesDeferred,
    getDailyExchangeRatesDeferred,
    getPreviousExchangeRatesDeferred;

  beforeEach(module('ts5App'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _currencyFactory_) {
      getCompanyBaseCurrencyDeferred = $q.defer();
      getCompanyCurrenciesDeferred = $q.defer();
      getDailyExchangeRatesDeferred = $q.defer();
      getPreviousExchangeRatesDeferred = $q.defer();
      currencyFactory = _currencyFactory_;
      scope = $rootScope.$new();

      createController = function () {
        spyOn(currencyFactory, 'getCompanyBaseCurrency').and.returnValue(getCompanyBaseCurrencyDeferred.promise);
        spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);
        spyOn(currencyFactory, 'getDailyExchangeRates').and.returnValue(getDailyExchangeRatesDeferred.promise);
        spyOn(currencyFactory, 'getPreviousExchangeRates').and.returnValue(getPreviousExchangeRatesDeferred.promise);
        ExchangeRatesCtrl = $controller('ExchangeRatesCtrl', {
          $scope: scope
        });
      };
    })
  );

  it('should have a breadcrumb property', function () {
    ExchangeRatesCtrl = createController();
    expect(scope.breadcrumb).toBeDefined();
  });

  it('should get the companyBaseCurrency from currencyFactory', function () {
    ExchangeRatesCtrl = createController();
    expect(currencyFactory.getCompanyBaseCurrency).toHaveBeenCalled();
    getCompanyBaseCurrencyDeferred.resolve({currencyCode: 'USD'});
    currencyFactory.getCompanyBaseCurrency().then(function (baseCurrency) {
      expect(baseCurrency.currencyCode).toBe('USD');
    });
    scope.$digest();
  });

  it('should get the companyBaseCurrency from currencyFactory', function () {
    ExchangeRatesCtrl = createController();
    expect(currencyFactory.getCompanyCurrencies).toHaveBeenCalled();
  });

  it('should get the DailyExchangeRates from currencyFactory', function () {
    ExchangeRatesCtrl = createController();
    getCompanyCurrenciesDeferred.resolve({
      companyCurrencies: [{
        id: 208,
        currencyId: 1,
        companyId: 374,
        currencyCode: 'USD'
      }]
    });
    getCompanyCurrenciesDeferred.resolve({
      dailyExchangeRates: [{
        chBaseCurrencyId: 8,
        chCompanyId: 374,
        dailyExchangeRateCurrencies: [{
          id: 127,
          dailyExchangeRateId: 51,
          retailCompanyCurrencyId: 208,
          bankExchangeRate: null
        }],
        exchangeRateDate: '2015-04-21',
        id: 51,
        isSubmitted: false,
        retailBaseCurrencyId: 1,
        retailCompanyId: 374
      }]
    });
    scope.$digest();
    console.log(scope.currenciesFields);
    expect(currencyFactory.getDailyExchangeRates).toHaveBeenCalled();
  });


  describe('Save daily exchange rates', function () {
    it('should generate the payload with is submitted false', function () {
      ExchangeRatesCtrl = createController();
      scope.$apply();
      scope.saveDailyExchangeRates();
      expect(scope.payload.dailyExchangeRate.isSubmitted).toBe(false);
    });

    it('should create the payload with the expected currencies', function () {
      ExchangeRatesCtrl = createController();
      scope.$apply();

      scope.companyCurrencies = [{
        currencyCode: 'GBP',
        currencyId: 8,
        id: 203
      }];
      scope.currenciesFields = {
        GBP: {
          coinExchangeRate: '1.0000',
          paperExchangeRate: '1.0000'
        }
      };
      scope.saveDailyExchangeRates();
      expect(scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies.length).toBe(1);
    });
  });
});
