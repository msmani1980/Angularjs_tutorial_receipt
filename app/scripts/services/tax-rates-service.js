'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxRatesService
 * @description
 * # taxRatesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('taxRatesService', function($resource, ENV, GlobalMenuService) {

    var requestURL = ENV.apiUrl + '/api/companies/:companyId/tax-rates/:id';

    var requestParameters = {
      id: '@id',
      companyId: '@companyId'
    };

    var actions = {
      getCompanyTaxRatesList: {
        method: 'GET'
      },
      getCompanyTaxRate: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyTaxRatesList = function(payload) {
      payload = payload || {};
      payload.companyId = GlobalMenuService.company.get();
      return requestResource.getCompanyTaxRatesList(payload).$promise;
    };

    var getCompanyTaxRate = function(id) {
      var payload = {};
      payload.companyId = GlobalMenuService.company.get();
      payload.id = id;
      return requestResource.getCompanyTaxRate(payload).$promise;
    };

    return {
      getCompanyTaxRatesList: getCompanyTaxRatesList,
      getCompanyTaxRate: getCompanyTaxRate
    };

  });
