'use strict';

/**
 * @ngdoc service
 * @name ts5App.dailyExchangeRatesService
 * @description
 * # dailyExchangeRatesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('dailyExchangeRatesService', function ($q, $resource) {
    var hostURL = 'https://ec2-52-6-49-188.compute-1.amazonaws.com';
    var dailyExchangeRatesURL = hostURL + '/api/daily-exchange-rates';
    var previousExchangeRatesURL = hostURL + '/api/daily-exchange-rates/previous-exchange-rate';

    var dailyExchangeRatesParameters = {
      retailCompanyId: 374,
      startDate: 20150413,
      endDate: 20150413
    };
    var previousExchangeRatesParameters = {
      retailCompanyId: 374,
      exchangeRateDate: 20150413
    };

    var actions = {
      getExchangeRates: {
        method: 'GET',
        headers: {
          'userId': 1,
          'companyId': 374
        }
      },
      create: {
        method: 'POST'
      }
    };

    var dailyExchangeRatesResource = $resource(dailyExchangeRatesURL, dailyExchangeRatesParameters, actions);
    var previousExchangeRatesResource = $resource(previousExchangeRatesURL, previousExchangeRatesParameters, actions);

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
      getPreviousExchangeRates: getPreviousExchangeRates
    };
  });
