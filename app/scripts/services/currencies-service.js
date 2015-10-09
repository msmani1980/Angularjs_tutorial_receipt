'use strict';

/**
 * @ngdoc service
 * @name ts5App.currenciesService
 * @description
 * # currenciesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('currenciesService', function ($q, $resource, GlobalMenuService, ENV) {
    var companyId = GlobalMenuService.company.get();

    var masterCurrenciesURL = ENV.apiUrl + '/api/currencies';
    var companyCurrenciesURL = ENV.apiUrl + '/api/company-currency-globals';
    var detailedCompanyCurrenciesURL = ENV.apiUrl + '/api/companies/' + companyId + '/currencies';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCurrencies: {
        method: 'GET'
      },
      create: {
        method: 'POST'
      }
    };
    var masterCurrenciesResource = $resource(masterCurrenciesURL, requestParameters, actions);
    var companyCurrenciesResource = $resource(companyCurrenciesURL, requestParameters, actions);
    var detailedCompanyCurrenciesResource = $resource(detailedCompanyCurrenciesURL, requestParameters, actions);

    var getCompanyGlobalCurrencies = function (payload) {
      return masterCurrenciesResource.getCurrencies(payload).$promise;
    };

    var getCompanyCurrencies = function (payload) {
      return companyCurrenciesResource.getCurrencies(payload).$promise;
    };

    var getDetailedCompanyCurrencies = function (payload) {
      return detailedCompanyCurrenciesResource.getCurrencies(payload).$promise;
    };

    return {
      getCompanyGlobalCurrencies: getCompanyGlobalCurrencies,
      getCompanyCurrencies: getCompanyCurrencies,
      getDetailedCompanyCurrencies: getDetailedCompanyCurrencies
    };
  });

