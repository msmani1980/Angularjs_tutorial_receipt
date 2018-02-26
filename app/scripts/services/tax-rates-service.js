'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxRatesService
 * @description
 * # taxRatesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('taxRatesService', function($resource, ENV, globalMenuService) {

    var requestURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/tax-rates/:id';

    var requestParameters = {
      id: '@id',
      companyId: globalMenuService.company.get()
    };

    var actions = {
      getCompanyTaxRatesList: {
        method: 'GET'
      },
      getCompanyTaxRate: {
        method: 'GET'
      },
      createCompanyTaxRate: {
        method: 'POST'
      },
      updateCompanyTaxRate: {
        method: 'PUT'
      },
      removeCompanyTaxRate: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyTaxRatesList = function(payload) {
      payload = payload || {};
      return requestResource.getCompanyTaxRatesList(payload).$promise;
    };

    var getCompanyTaxRate = function(id) {
      var payload = {};
      payload.id = id;
      return requestResource.getCompanyTaxRate(payload).$promise;
    };

    var removeCompanyTaxRate = function(id) {
      var payload = {};
      payload.id = id;
      return requestResource.removeCompanyTaxRate(payload).$promise;
    };

    var updateCompanyTaxRate = function(payload) {
      return requestResource.updateCompanyTaxRate(payload).$promise;
    };

    var createCompanyTaxRate = function(payload) {
      return requestResource.createCompanyTaxRate(payload).$promise;
    };

    return {
      getCompanyTaxRatesList: getCompanyTaxRatesList,
      getCompanyTaxRate: getCompanyTaxRate,
      removeCompanyTaxRate: removeCompanyTaxRate,
      updateCompanyTaxRate: updateCompanyTaxRate,
      createCompanyTaxRate: createCompanyTaxRate
    };

  });
