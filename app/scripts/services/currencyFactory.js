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

    var getCompanyBaseCurrency = function(){
      var baseCurrencyId = getCompany(326).baseCurrencyId;
      return currencies.getCompanyBaseCurrency(baseCurrencyId);
    };

    var getCompanyCurrencies = function() {
      return currencies.getCompanyCurrencies();
    };

    var getDailyExchangeRates = function() {
      return dailyExchangeRatesService.getDailyExchangeRates();
    };

    var getPreviousExchangeRates = function() {
      return dailyExchangeRatesService.getPreviousExchangeRates();
    };

    return {
      getCompanyBaseCurrency: getCompanyBaseCurrency,
      getCompanyCurrencies: getCompanyCurrencies,
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates
    };

  });
