'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencies
 * @description
 * # currencies
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('currencies', function ($q, $resource, ENV, GlobalMenuService) {

    var company = GlobalMenuService.company.get();

    var globalCurrenciesURL = ENV.apiUrl + '/api/currencies';
    var companyCurrenciesURL = ENV.apiUrl + '/api/companies/:companyId/currencies';
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
    var companyCurrenciesResource = $resource(companyCurrenciesURL, {companyId: company.id}, actions);

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

    var getCompanyCurrencies = function () {
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
