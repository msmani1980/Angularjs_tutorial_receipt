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
    var dailyExchangeRatesURL = 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/daily-exchange-rates';
    var paramDefaults = {
      retailCompanyId:326,
      startDate:20150413,
      endDate:20150413
    };

    var actions = {
      getDailyExchangeRates: {
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

    var dailyExchangeRatesResource = $resource(dailyExchangeRatesURL, paramDefaults, actions);

    var getDailyExchangeRates = function () {
      var dailyExchangeRatesDeferred = $q.defer();
      dailyExchangeRatesResource.getDailyExchangeRates().$promise.then(function (data) {
        dailyExchangeRatesDeferred.resolve(data.dailyExchangeRates);
      });
      return dailyExchangeRatesDeferred.promise;
    };
    return {
      getDailyExchangeRates: getDailyExchangeRates
    };
  });
