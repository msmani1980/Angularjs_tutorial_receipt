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
