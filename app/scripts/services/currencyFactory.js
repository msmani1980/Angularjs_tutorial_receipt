'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencyFactory
 * @description
 * # currencyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('currencyFactory', function ($q, $resource, currenciesService, dailyExchangeRatesService) {
    var getCompany = function (companyId) {
      return {
        'id': companyId,
        'companyName': 'Virgin Australia',
        'legalName': 'Virgin Australia',
        'baseCurrencyId': 1,
        'exchangeRateVariance': '10.0000'
      };
    };

    var getCompanyBaseCurrency = function () {
      var baseCurrencyId = getCompany(326).baseCurrencyId;
      return currenciesService.getCompanyBaseCurrency(baseCurrencyId);
    };

    var getDailyExchangeRatesFromAPI = function (cashierDate) {
      return dailyExchangeRatesService.getDailyExchangeRates(cashierDate);
    };

    var getPreviousExchangeRates = function () {
      return dailyExchangeRatesService.getPreviousExchangeRates();
    };

    var getDailyExchangeRates = function (cashierDate) {
      var deferred = $q.defer();

      getDailyExchangeRatesFromAPI(cashierDate).then(function (dailyExchangeRates) {
        if (dailyExchangeRates && dailyExchangeRates.length > 0) {
          deferred.resolve(dailyExchangeRates);
        } else {
          deferred.resolve(getPreviousExchangeRates());
        }
      });
      return deferred.promise;
    };

    return {
      getCompanyBaseCurrency: getCompanyBaseCurrency,
      getCompanyCurrencies: currenciesService.getCompanyCurrencies,
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: dailyExchangeRatesService.saveDailyExchangeRates
    };

  });
