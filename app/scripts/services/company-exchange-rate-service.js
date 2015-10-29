'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyExchangeRateService
 * @description
 * # companyExchangeRateService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyExchangeRateService', function ($q, $resource, GlobalMenuService, ENV) {
    var companyId = GlobalMenuService.company.get();
    var companyExchangeRatesURL = ENV.apiUrl + '/api/companies/:companyId/exchange-rates/:id';

    var requestParameters = {
      id: '@id',
      companyId: companyId,
      exchangeRateType: 1
    };

    var actions = {
      getCompanyExchangeRates: {
        method: 'GET'
      },
      createCompanyExchangeRate: {
        method: 'POST'
      },
      updateCompanyExchangeRate: {
        method: 'PUT'
      },
      deleteCompanyExchangeRate: {
        method: 'DELETE'
      }
    };

    var companyExchangeRatesResource = $resource(companyExchangeRatesURL, requestParameters, actions);

    var getCompanyExchangeRates = function (payload) {
      return companyExchangeRatesResource.getCompanyExchangeRates(payload).$promise;
    };

    var createCompanyExchangeRate = function (payload) {
      return companyExchangeRatesResource.createCompanyExchangeRate(payload).$promise;
    };
    var updateCompanyExchangeRate = function (payload) {
      return companyExchangeRatesResource.updateCompanyExchangeRate(payload).$promise;
    };

    var deleteCompanyExchangeRate = function (exchangeRate) {
      return companyExchangeRatesResource.deleteCompanyExchangeRate({id: exchangeRate}).$promise;
    };

    return {
      getCompanyExchangeRates: getCompanyExchangeRates,
      deleteCompanyExchangeRate: deleteCompanyExchangeRate,
      createCompanyExchangeRate: createCompanyExchangeRate,
      updateCompanyExchangeRate: updateCompanyExchangeRate
    };
  });
