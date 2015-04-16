'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencies
 * @description
 * # currencies
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('currencies', function ($q, $resource) {
    var url = 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies';
    var paramDefaults = {};
    var actions = {
      getCurrencies: {
        method: 'GET',
        headers: {
          'userId': 1,
          'companyId': 326
        }
      },
      create: {
        method: 'POST'
      }
    };
    var currenciesResource = $resource(url, paramDefaults, actions);

    var getBaseCurrency = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    var getCompanyBaseCurrency = function (baseCurrencyId) {
      var baseCompanyDeferred = $q.defer();
      currenciesResource.getCurrencies().$promise.then(function (data) {
        baseCompanyDeferred.resolve(getBaseCurrency(data.response, baseCurrencyId));
      });
      return baseCompanyDeferred.promise;
    };

    return {
      getCompanyBaseCurrency: getCompanyBaseCurrency
    };
  });
