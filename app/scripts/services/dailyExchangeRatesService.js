'use strict';

/**
 * @ngdoc service
 * @name ts5App.dailyExchangeRatesService
 * @description
 * # dailyExchangeRatesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('dailyExchangeRatesService', function ($q, $http, $resource, baseUrl) {
    $http.defaults.headers.common.userId = 1;
    $http.defaults.headers.common.companyId = 362;
    var dailyExchangeRatesURL = baseUrl + '/api/daily-exchange-rates/:exchangeRateId';
    var previousExchangeRatesURL = baseUrl + '/api/daily-exchange-rates/previous-exchange-rate';

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
      var deferred = $q.defer();
      dailyExchangeRatesParameters.startDate = cashierDate;
      dailyExchangeRatesParameters.endDate = cashierDate;
      dailyExchangeRatesResource.getExchangeRates().$promise.then(function (data) {
        deferred.resolve(data.dailyExchangeRates);
      });
      return deferred.promise;
    };

    var getPreviousExchangeRates = function () {
      var deferred = $q.defer();
      previousExchangeRatesResource.getExchangeRates().$promise.then(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    return {
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: saveDailyExchangeRates
    };
  });
