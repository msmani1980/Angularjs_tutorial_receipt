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

    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    var masterCurrenciesURL = ENV.apiUrl + '/api/currencies/:id';
    var companyCurrenciesURL = ENV.apiUrl + '/api/company-currency-globals';
    var detailedCompanyCurrenciesURL = ENV.apiUrl + '/api/companies/:companyId/currencies/:id';

    var requestParameters = {
      id: '@id',
      companyId: '@companyId'
    };

    var actions = {
      getMasterCurrency: {
        method: 'GET'
      },
      getCurrencies: {
        method: 'GET'
      },
      createDetailedCompanyCurrency: {
        method: 'POST'
      },
      updateDetailedCompanyCurrency: {
        method: 'PUT'
      },
      getDetailedCompanyCurrencies: {
        method: 'GET'
      },
      deleteDetailedCompanyCurrency: {
        method: 'DELETE'
      }
    };

    var masterCurrenciesResource = $resource(masterCurrenciesURL, requestParameters, actions);
    var companyCurrenciesResource = $resource(companyCurrenciesURL, requestParameters, actions);
    var detailedCompanyCurrenciesResource = $resource(detailedCompanyCurrenciesURL, requestParameters, actions);

    var getMasterCurrency = function (id) {
      requestParameters.id = id;
      return masterCurrenciesResource.getMasterCurrency().$promise;
    };

    var getCompanyGlobalCurrencies = function (payload) {
      return masterCurrenciesResource.getCurrencies(payload).$promise;
    };

    var getCompanyCurrencies = function (payload) {
      return companyCurrenciesResource.getCurrencies(payload).$promise;
    };

    var getDetailedCompanyCurrencies = function (payload) {
      payload = payload || {};
      payload.companyId = getCompanyId();
      return detailedCompanyCurrenciesResource.getDetailedCompanyCurrencies(payload).$promise;
    };

    var deleteDetailedCompanyCurrency = function (currencyId) {
      var payload = {
        id: currencyId,
        companyId: getCompanyId()
      };
      return detailedCompanyCurrenciesResource.deleteDetailedCompanyCurrency(payload).$promise;
    };

    var createDetailedCompanyCurrency = function (payload) {
      payload = payload || {};
      payload.companyId = getCompanyId();
      return detailedCompanyCurrenciesResource.createDetailedCompanyCurrency(payload).$promise;
    };

    var updateDetailedCompanyCurrency = function (payload) {
      payload = payload || {};
      payload.companyId = getCompanyId();
      return detailedCompanyCurrenciesResource.updateDetailedCompanyCurrency(payload).$promise;
    };

    return {
      getCompanyGlobalCurrencies: getCompanyGlobalCurrencies,
      getCompanyCurrencies: getCompanyCurrencies,
      getDetailedCompanyCurrencies: getDetailedCompanyCurrencies,
      deleteDetailedCompanyCurrency: deleteDetailedCompanyCurrency,
      createDetailedCompanyCurrency: createDetailedCompanyCurrency,
      updateDetailedCompanyCurrency: updateDetailedCompanyCurrency,
      getMasterCurrency: getMasterCurrency
    };
  });
