'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencyFactory
 * @description
 * # currencyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('currencyFactory', function ($q, $resource, currenciesService, dailyExchangeRatesService, companiesService) {

    var getCurrencyFromArrayUsingId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    var getCompanyBaseCurrency = function (companyId) {

      var deferred = $q.defer();

      companiesService.getCompany(companyId).then(function(companyDataFromAPI){
        currenciesService.getCompanyGlobalCurrencies().then(function (data) {
          deferred.resolve(getCurrencyFromArrayUsingId(data.response, companyDataFromAPI.baseCurrencyId));
        });
      });

      return deferred.promise;
    };

    var getPreviousExchangeRates = function (cashierDate) {
      return dailyExchangeRatesService.getPreviousExchangeRates(cashierDate);
    };

    var getDailyExchangeRates = function (cashierDate) {
      return dailyExchangeRatesService.getDailyExchangeRates(cashierDate);
    };

    return {
      getCompanyBaseCurrency: getCompanyBaseCurrency,
      getCompanyCurrencies: currenciesService.getCompanyCurrencies,
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: dailyExchangeRatesService.saveDailyExchangeRates
    };

  });
