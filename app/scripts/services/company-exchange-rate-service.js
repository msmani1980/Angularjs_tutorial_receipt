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
    var companyExchangeRatesURL = ENV.apiUrl + '/api/companies/:companyId/exchange-rates:id';

    var requestParameters = {
      id: '@id',
      companyId: companyId,
      exchangeRateType: 1
    };

    var actions = {
      getCompanyExchangeRates: {
        method: 'GET'
      },
      createCompanyExchangeRates: {
        method: 'POST'
      },
      updateCompanyExchangeRates: {
        method: 'PUT'
      },
      deleteCompanyExchangeRates: {
        method: 'DELETE'
      }
    };

    var companyExchangeRatesResource = $resource(companyExchangeRatesURL, requestParameters, actions);

    var getCompanyExchangeRates = function (payload) {
      return companyExchangeRatesResource.getCompanyExchangeRates(payload).$promise;
    };

    return {
      getCompanyExchangeRates: getCompanyExchangeRates
    };
  });
