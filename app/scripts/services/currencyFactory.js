'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencyFactory
 * @description
 * # currencyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('currencyFactory', function ($q, $resource, currencies, dailyExchangeRatesService) {
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
      return currencies.getCompanyBaseCurrency(baseCurrencyId);
    };

    var getCompanyCurrencies = function () {
      return currencies.getCompanyCurrencies();
    };

    var getDailyExchangeRatesFromAPI = function (cashierDate) {
      return dailyExchangeRatesService.getDailyExchangeRates(cashierDate);
    };

    var getPreviousExchangeRates = function () {
      return dailyExchangeRatesService.getPreviousExchangeRates();
    };

    var saveDailyExchangeRates = function (payload) {
      return dailyExchangeRatesService.saveDailyExchangeRates(payload);
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
      getCompanyCurrencies: getCompanyCurrencies,
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: saveDailyExchangeRates
    };

  });
