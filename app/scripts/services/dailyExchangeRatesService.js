'use strict';

/**
 * @ngdoc service
 * @name ts5App.dailyExchangeRatesService
 * @description
 * # dailyExchangeRatesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('dailyExchangeRatesService', function ($q, $http, $resource, ENV) {
    var dailyExchangeRatesURL = ENV.apiUrl + '/api/daily-exchange-rates/:exchangeRateId';
    var previousExchangeRatesURL = ENV.apiUrl + '/api/daily-exchange-rates/previous-exchange-rate';

    var dailyExchangeRatesParameters = {
      exchangeRateId: '@dailyExchangeRate.id'
    };

    var previousExchangeRatesParameters = {};

    var actions = {
      getExchangeRates: {
        method: 'GET',
        headers: {
          companyId: 362
        }
      },
      createExchangeRate: {
        method: 'POST',
        headers: {
          companyId: 362
        }
      },
      updateExchangeRate: {
        method: 'PUT',
        headers: {
          companyId: 362
        }
      }
    };

    var previousExchangeRatesResource = $resource(previousExchangeRatesURL, previousExchangeRatesParameters, actions);
    var dailyExchangeRatesResource = $resource(dailyExchangeRatesURL, dailyExchangeRatesParameters, actions);

    var saveDailyExchangeRates = function (payload) {
      var method = 'create';
      if (payload.dailyExchangeRate.id) {
        method = 'update';
      }
      return dailyExchangeRatesResource[method + 'ExchangeRate'](payload).$promise;
    };

    var getDailyExchangeRates = function (companyId, cashierDate) {
      var payload = {
        retailCompanyId: companyId,
        startDate: cashierDate,
        endDate: cashierDate
      };
      return dailyExchangeRatesResource.getExchangeRates(payload).$promise;
    };

    var getPreviousExchangeRates = function (companyId, cashierDate) {
      var payload = {
        retailCompanyId: companyId,
        exchangeRateDate: cashierDate
      };
      return previousExchangeRatesResource.getExchangeRates(payload).$promise;
    };

    return {
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: saveDailyExchangeRates
    };
  });
