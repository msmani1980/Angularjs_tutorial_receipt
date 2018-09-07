'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyExchangeRateService
 * @description
 * # companyExchangeRateService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyExchangeRateService', function ($q, $resource, globalMenuService, ENV, Upload) {

    var companyExchangeRatesURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/exchange-rates/:id';

    var requestParameters = {
      id: '@id',
      companyId: '@companyId',
      exchangeRateType: '@exchangeRateType'
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
      payload = payload || {};
      payload.companyId = globalMenuService.company.get();
      return companyExchangeRatesResource.getCompanyExchangeRates(payload).$promise;
    };

    var createCompanyExchangeRate = function (payload) {
      return companyExchangeRatesResource.createCompanyExchangeRate(payload).$promise;
    };

    var updateCompanyExchangeRate = function (payload) {
      return companyExchangeRatesResource.updateCompanyExchangeRate(payload).$promise;
    };

    var deleteCompanyExchangeRate = function (payload) {
      return companyExchangeRatesResource.deleteCompanyExchangeRate(payload).$promise;
    };

    var importFromExcel = function (companyId, file) {
      var uploadRequestURL = ENV.apiUrl + '/rsvr-upload/companies/' + companyId + '/file/eposexchangerate';
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      });
    };

    return {
      importFromExcel: importFromExcel,
      getCompanyExchangeRates: getCompanyExchangeRates,
      deleteCompanyExchangeRate: deleteCompanyExchangeRate,
      createCompanyExchangeRate: createCompanyExchangeRate,
      updateCompanyExchangeRate: updateCompanyExchangeRate
    };
  });
