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

    var previousExchangeRatesParameters = {
    };

    var actions = {
      getExchangeRates: {
        method: 'GET'
      },
      createExchangeRate: {
        method: 'POST'
      },
      updateExchangeRate: {
        method: 'PUT'
      }
    };

    var previousExchangeRatesResource = $resource(previousExchangeRatesURL, previousExchangeRatesParameters, actions);
    var dailyExchangeRatesResource = $resource(dailyExchangeRatesURL, dailyExchangeRatesParameters, actions);

    var saveDailyExchangeRates = function (payload) {
      var deferred = $q.defer();
      var method = 'create';
      if (payload.dailyExchangeRate.id) {
        method = 'update';
      }
      dailyExchangeRatesResource[method + 'ExchangeRate'](payload).$promise.then(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    var getDailyExchangeRates = function (cashierDate) {
      dailyExchangeRatesParameters.startDate = cashierDate;
      dailyExchangeRatesParameters.endDate = cashierDate;
      return dailyExchangeRatesResource.getExchangeRates().$promise;
    };

    var getPreviousExchangeRates = function () {
      return previousExchangeRatesResource.getExchangeRates().$promise;
    };

    return {
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: saveDailyExchangeRates
    };
  });
