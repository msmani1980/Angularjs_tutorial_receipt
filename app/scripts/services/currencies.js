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
    var globalCurrenciesURL = 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies';
    var companyCurrenciesURL = 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/companies/:companyId/currencies';
    var paramDefaults = {};
    var actions = {
      getCurrencies: {
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
    var globalCurrenciesResource = $resource(globalCurrenciesURL, paramDefaults, actions);
    var companyCurrenciesResource = $resource(companyCurrenciesURL, {companyId: 374}, actions);

    var getBaseCurrency = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    var getCompanyBaseCurrency = function (baseCurrencyId) {
      var baseCompanyDeferred = $q.defer();
      globalCurrenciesResource.getCurrencies().$promise.then(function (data) {
        baseCompanyDeferred.resolve(getBaseCurrency(data.response, baseCurrencyId));
      });
      return baseCompanyDeferred.promise;
    };

    var getCompanyCurrencies = function (baseCurrencyId) {
      var baseCompanyDeferred = $q.defer();
      companyCurrenciesResource.getCurrencies().$promise.then(function (data) {
        baseCompanyDeferred.resolve(data.companyCurrencies);
      });
      return baseCompanyDeferred.promise;
    };

    return {
      getCompanyBaseCurrency: getCompanyBaseCurrency,
      getCompanyCurrencies: getCompanyCurrencies
    };
  });
