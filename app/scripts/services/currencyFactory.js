'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencyFactory
 * @description
 * # currencyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('currencyFactory', function ($q, $resource) {
    var url = 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies';
    var paramDefaults = {};

    var getCompany = function (companyId) {
      return {
        'id': companyId,
        'companyName': 'Virgin Australia',
        'legalName': 'Virgin Australia',
        'baseCurrencyId': 1,
        'exchangeRateVariance': '10.0000'
      };
    };

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

    var baseCurrencyId = getCompany(326).baseCurrencyId;

    var currenciesResource = $resource(url, paramDefaults, actions);
    var getBaseCurrency = function (currenciesArray) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    var getCompanyBaseCurrency = function () {
    var baseCompanyDeferred = $q.defer();
      currenciesResource.getCurrencies().$promise.then(function (data) {
        baseCompanyDeferred.resolve(getBaseCurrency(data.response));
      });
      return baseCompanyDeferred.promise;
    };

    return {
      getCompanyBaseCurrency: getCompanyBaseCurrency
    };

  });
