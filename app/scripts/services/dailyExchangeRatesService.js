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
    var dailyExchangeRatesURL = ENV.apiUrl + '/api/daily-exchange-rates/:exchangeRateId/:id';
    var previousExchangeRatesURL = ENV.apiUrl + '/api/daily-exchange-rates/previous-exchange-rate';
    var dailyExchangeRatesForCmpURL = ENV.apiUrl + '/api/dailyexchangerate';

    var dailyExchangeRatesParameters = {
      exchangeRateId: '@dailyExchangeRate.id',
      id: '@id'
    };

    var dailyExchangeRatesForCmpParameters = {
      chCompanyId: '@chCompanyId',
      retailCompanyId: '@retailCompanyId',
      exchangeRateDate: '@exchangeRateDate'
    };
    var previousExchangeRatesParameters = {};

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
    var dailyExchangeRatesForCmpResource = $resource(dailyExchangeRatesForCmpURL, dailyExchangeRatesForCmpParameters, actions);

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

    var getDailyExchangeById = function (companyId, dailyExchangeRateId) {
      var payload = {
        exchangeRateId: dailyExchangeRateId,
        retailCompanyId: companyId
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

    var getDailyExchangeRatesForCmp = function (companyId, retailCompanyId, exchangeRateDate) {
      var payload = {
        chCompanyId: companyId,
        retailCompanyId: retailCompanyId,
        exchangeRateDate: exchangeRateDate
      };
      return dailyExchangeRatesForCmpResource.getExchangeRates(payload).$promise;
    };

    return {
      getDailyExchangeRates: getDailyExchangeRates,
      getDailyExchangeById: getDailyExchangeById,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: saveDailyExchangeRates,
      getDailyExchangeRatesForCmp: getDailyExchangeRatesForCmp
    };
  });
