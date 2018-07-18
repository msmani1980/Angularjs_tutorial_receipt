'use strict';

/**
 * @ngdoc service
 * @name ts5App.routeTaxRatesService
 * @description
 * # routeTaxRatesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('routeTaxRatesService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/route-tax-rates/:id';
    var requestParameters = {
      companyId: '@companyId',
      id: '@id'
    };

    var actions = {
      getRouteTaxRates: {
        method: 'GET'
      },
      getRouteTaxRate: {
        method: 'GET'
      },
      createRouteTaxRate: {
        method: 'POST'
      },
      updateRouteTaxRate: {
        method: 'PUT'
      },
      removeRouteTaxRate: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getRouteTaxRates = function (payload) {
      return requestResource.getRouteTaxRates(payload).$promise;
    };

    var getRouteTaxRate = function (id) {
      return requestResource.getRouteTaxRate({ id: id }).$promise;
    };

    var createRouteTaxRate = function (payload) {
      return requestResource.createRouteTaxRate(payload).$promise;
    };

    var updateRouteTaxRate = function (id, payload) {
      return requestResource.updateRouteTaxRate({ id: id }, payload).$promise;
    };

    var removeRouteTaxRate = function (id) {
      return requestResource.removeRouteTaxRate({ id: id }).$promise;
    };

    return {
      getRouteTaxRates: getRouteTaxRates,
      getRouteTaxRate: getRouteTaxRate,
      createRouteTaxRate: createRouteTaxRate,
      updateRouteTaxRate: updateRouteTaxRate,
      removeRouteTaxRate: removeRouteTaxRate
    };
  });
