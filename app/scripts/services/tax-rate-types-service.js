'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxRateTypesService
 * @description
 * # taxRateTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('taxRateTypesService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + 'api/records/tax-rate-types';
    var requestParameters = {
      limit: 50
    };

    var actions = {
      getTaxRateTypes: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getTaxRateTypes = function (payload) {
      return requestResource.getTaxRateTypes(payload).$promise;
    };

    return {
      getTaxRateTypes: getTaxRateTypes
    };
  });
