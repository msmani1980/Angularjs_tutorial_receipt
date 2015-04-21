'use strict';

describe('Controller: ExchangeRatesCtrl', function () {
  // load the controller's module

  var ExchangeRatesCtrl,
    scope,
    createController,
    currencyFactory;

  beforeEach(module('ts5App'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _currencyFactory_) {
      var deferred = $q.defer();
      currencyFactory = _currencyFactory_;
      scope = $rootScope.$new();
      createController = function () {
        spyOn(currencyFactory, 'getCompanyBaseCurrency').and.returnValue(deferred.promise);
        spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(deferred.promise);
        spyOn(currencyFactory, 'getDailyExchangeRates').and.returnValue(deferred.promise);
        spyOn(currencyFactory, 'getPreviousExchangeRates').and.returnValue(deferred.promise);
        ExchangeRatesCtrl = $controller('ExchangeRatesCtrl', {
          $scope: scope
        });
        deferred.resolve({fake: 'data'});
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
  });

  it('should get the companyBaseCurrency from currencyFactory', function () {
    ExchangeRatesCtrl = createController();
    expect(currencyFactory.getCompanyCurrencies).toHaveBeenCalled();
  });

  it('should get the DailyExchangeRates from currencyFactory', function () {
    ExchangeRatesCtrl = createController();
    scope.$apply();
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
          coinExchangeRate: 'asdf',
          paperExchangeRate: 'asdf'
        }
      };
      scope.saveDailyExchangeRates();
      expect(scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies.length).toBe(1);
    });
  });
});
