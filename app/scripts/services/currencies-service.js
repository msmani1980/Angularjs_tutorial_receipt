'use strict';

/**
 * @ngdoc service
 * @name ts5App.currenciesService
 * @description
 * # currenciesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('currenciesService', function ($q, $resource, globalMenuService, ENV, Upload) {

    var getCompanyId = function () {
      var companyData = globalMenuService.getCompanyData();
      if (companyData.chCompany && companyData.chCompany.companyId) {
        return companyData.chCompany.companyId;
      }

      return companyData.companyId;
    };

    var masterCurrenciesURL = ENV.apiUrl + '/rsvr/api/currencies/:id';
    var companyCurrenciesURL = ENV.apiUrl + '/rsvr/api/company-currency-globals';
    var detailedCompanyCurrenciesURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/currencies/:id';

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
        
        // companyId is required as a header here.  header is defined at function call
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
      actions.getCurrencies.headers = {
        companyId: getCompanyId()
      };
      masterCurrenciesResource = $resource(masterCurrenciesURL, requestParameters, actions);
      return masterCurrenciesResource.getCurrencies(payload).$promise;
    };

    var getCompanyCurrencies = function (payload) {
      actions.getCurrencies.headers = {
        companyId: getCompanyId()
      };
      companyCurrenciesResource = $resource(companyCurrenciesURL, requestParameters, actions);
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

    var importFromExcel = function (companyId, file) {
      var uploadRequestURL = ENV.apiUrl + '/rsvr-upload/companies/' + companyId + '/file/reportexchangerate';
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      });
    };

    return {
      importFromExcel: importFromExcel,
      getCompanyGlobalCurrencies: getCompanyGlobalCurrencies,
      getCompanyCurrencies: getCompanyCurrencies,
      getDetailedCompanyCurrencies: getDetailedCompanyCurrencies,
      deleteDetailedCompanyCurrency: deleteDetailedCompanyCurrency,
      createDetailedCompanyCurrency: createDetailedCompanyCurrency,
      updateDetailedCompanyCurrency: updateDetailedCompanyCurrency,
      getMasterCurrency: getMasterCurrency
    };
  });
